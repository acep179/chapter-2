const express = require('express')
const app = express()

const db = require('./src/connection/db')
const upload = require('./src/middleware/upload')

const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('express-flash')

const { query } = require('express')

    
const port = process.env.PORT || 8000

app.set('view engine','hbs')
app.use('/assets', express.static('assets'))
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: 'acep awaludin',
    resave: false,
    saveUnitialized: true,
    cookie: {
    maxAge: 2 * 60 * 60 * 1000 //milisecond to 2 hour,, max age 2 hour
    }
}))


//. Rendering
app.get('/contact', function(req,res){
    res.render('contact', {isLogin: req.session.isLogin, user: req.session.user})
})
app.get('/register', function(req,res){
    res.render('register',{isLogin: req.session.isLogin, user: req.session.user})
})
app.get('/login', function(req,res){
    res.render('login',{isLogin: req.session.isLogin, user: req.session.user})
})
app.get('/add-project', function(req,res){

    if(!req.session.user){
        req.flash('danger', 'Silakan Login Terlebih Dahulu')
        return res.redirect('/login')
    }

    res.render('add-project',{isLogin: req.session.isLogin, user: req.session.user})
})

//! Render Home sudah sekalian dengan Menampilkan Project di bawah


//. Database Connect

db.connect(function(err,client,done){
    if(err) throw err

    //. Register

    app.post('/register', function (req,res,next) {
        
        let {userName,userEmail,userPassword} = req.body

        const saltRound = 10
        const hashedPassword = bcrypt.hashSync(userPassword, saltRound)
        const query2 = `INSERT INTO tb_user(name, email, password)
        VALUES ('${userName}','${userEmail}','${hashedPassword}');`

        client.query(query, function(err, result){
            if(err) throw err
            
            res.redirect('/login')
        })
    })
    
    //. Login
    
    app.post('/login', function (req,res,next) {

        let {userEmail, userPassword} = req.body

        const query = `SELECT * FROM tb_user WHERE email = '${userEmail}'`
    
        client.query(query, function(err,result){
    
            if(err) throw err
    
            if(result.rows.length == 0) {
                req.flash('danger','Email belum terdaftar')
                return res.redirect('/login')
            }
    
            const isMatch = bcrypt.compareSync(userPassword, result.rows[0].password)

            console.log(isMatch)
    
            if(isMatch) {

                console.log('login berhasil');
    
                req.session.isLogin = true
                req.session.user = {
                    id: result.rows[0].id,
                    name: result.rows[0].name,
                    email: result.rows[0].email
                }
    
                req.flash('success', 'Login Success!')
                res.redirect ('/')
    
            } else {
                
                console.log('password salah')
                req.flash('danger', 'Password salah')
                res.redirect('/login')
                
            }
    
        })
    })

    //. Add Project

    app.post('/add-project', upload.single('projectImage'), function (req,res,next) {
        
        let data = req.body
        let html = getTechnology(data.projectHTML)
        let css = getTechnology(data.projectCSS)
        let js = getTechnology(data.projectJS)
        let tailwind = getTechnology(data.projectTailwind)
        let sass = getTechnology(data.projectSASS)
        
        const query = `INSERT INTO tb_project(name, author_id, start_date, end_date, description, technologies, image)
        VALUES ('${data.projectName}','${req.session.user.id}','${data.projectStartDate}','${data.projectEndDate}', '${data.projectDescription}','{${html},${css},${js},${tailwind},${sass}}','${req.file.path}');`

        client.query(query, function(err, result){
            if(err) throw err
            
            res.redirect('/#myProject')
        })
    })

    //. Edit Project

    app.get('/edit-project/:index', function(req,res){

        if(!req.session.user){
            req.flash('danger', 'Silakan Login Terlebih Dahulu')
            return res.redirect('/login')
        }    

        let index = req.params.index

        client.query(`SELECT * FROM tb_project WHERE id=${index}`, function(err,result){
            if(err) throw err
            
            let data = result.rows[0]
            let startDate = data.start_date.toISOString().split('T')[0]
            let endDate = data.end_date.toISOString().split('T')[0]
            let html = data.technologies[0]
            let css = data.technologies[1]
            let js = data.technologies[2]
            let tailwind = data.technologies[3]
            let sass = data.technologies[4]

            res.render('edit-project', {isLogin: req.session.isLogin, user: req.session.user, index, data, html, css,js, tailwind,sass,startDate,endDate})
        })
    })

    app.post('/edit-project/:index', upload.single("projectImage"), function (req,res) {
        
        let index = req.params.index

        let data = req.body
        
        let html = getTechnology(data.projectHTML)
        let css = getTechnology(data.projectCSS)
        let js = getTechnology(data.projectJS)
        let tailwind = getTechnology(data.projectTailwind)
        let sass = getTechnology(data.projectSASS)
        
        const query = `UPDATE tb_project SET name='${data.projectName}', start_date='${data.projectStartDate}', end_date='${data.projectEndDate}', description='${data.projectDescription}', technologies='{${html},${css},${js},${tailwind},${sass}}', image='${req.file.path}' WHERE id=${index}`

        client.query(query, function(err, result){
            if(err) throw err
            
            res.redirect('/#myProject')
        })
    })

    //. Menampilkan Project + Render Home

    app.get('/', function(req,res){

        const query = `SELECT tb_project.id,author_id,tb_user.name as author, tb_project.name,start_date, end_date,tb_project.description,tb_project.technologies,tb_project.image FROM tb_project LEFT JOIN tb_user ON tb_project.author_id = tb_user.id ORDER BY id DESC`

        client.query(query, function(err,result){
            if(err) throw err
            let dataProject = result.rows.map(function(item){
                return {
                    ...item,
                yearDuration: getYearDuration(item.start_date,item.end_date),
                monthDuration: getMonthDuration(item.start_date,item.end_date),
                descriptionShort: item.description.slice(0,90),
                isLogin: req.session.isLogin
                }
            })

            let filterProject
            if(req.session.user){
                filterProject = dataProject.filter(function(item) {
                    return item.author_id === req.session.user.id
                })
            }

            let resultProject = req.session.user ? filterProject : dataProject 

            res.render('index',{isLogin: req.session.isLogin, projects: resultProject, user: req.session.user})
        })
    })
        

    //.  Menampilkan Detail Project Berdasarkan ID

    app.get('/project-detail/:index', function(req,res){

        let index = req.params.index

            client.query(`SELECT * FROM tb_project WHERE id=${index}`, function(err,result){
                if(err) throw err
                let data = result.rows[0]

                let shortStartDate = getDateName(data.start_date)
                let shortEndDate = getDateName(data.end_date)
                let yearDuration = getYearDuration(data.start_date,data.end_date)
                let monthDuration = getMonthDuration(data.start_date,data.end_date)
                let technologiesName = getTechnologiesName(data)

                res.render('project-detail',{isLogin: req.session.isLogin, user: req.session.user, projects: data, shortStartDate, shortEndDate, yearDuration, monthDuration, technologiesName})
                })
                
            })

    //. Menghapus Project

    app.get('/delete-project/:index', function(req,res) {

        if(!req.session.user){
            req.flash('danger', 'Silakan Login Terlebih Dahulu')
            return res.redirect('/login')
        }
    
        let index = req.params.index
        client.query(`DELETE FROM tb_project WHERE id=${index}`, function(err,result){
            if(err) throw err
            res.redirect('/#myProject')
        })
    })

    //. Logout
    
    app.get('/logout', function(req,res){
        req.session.destroy()
        res.redirect('/')
    })

})

//. Functions

const getMonthDuration = (startDate, endDate) => {

    let getMiliSecond = endDate - startDate
    
    let setYearDuration = Math.floor(getMiliSecond/1000/60/60/24/365)
    let setMonthDuration = Math.floor(getMiliSecond/1000/60/60/24/30)-(setYearDuration*12)
    
    return setMonthDuration
}

const getYearDuration = (startDate, endDate) => {

    let getMiliSecond = endDate - startDate
    
    let setYearDuration = Math.floor(getMiliSecond/1000/60/60/24/365)
    
    if(setYearDuration > 0){
        return setYearDuration
    }
}

const getDateName = (date) => {
    
    let monthArr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Agt','Sep','Okt','Nov','Dec']
    
    let getMonth = date.getMonth()
    let monthName = monthArr[getMonth]

    let yearNumber = date.getFullYear()

    let dateNumber = date.getDate()
    
    return shortDate = `${dateNumber} ${monthName} ${yearNumber}`
}

const getTechnologiesName = (data) => {

    let names = []

    for (let i = 0; i < data.technologies.length; i++) {
    
        let item = data.technologies[i];
        
        let technologyName

        if(item == '<i class="bx bxl-html5 fs-1"></i>'){
            technologyName = 'HTML'
        } else if(item == '<i class="bx bxl-css3 fs-1"></i>'){
            technologyName = 'CSS'
        } else if(item == '<i class="bx bxl-javascript fs-1"></i>'){
            technologyName = 'JavaScript'
        } else if(item == '<i class="bx bxl-tailwind-css fs-1"></i>'){
            technologyName = 'TailwindCSS'
        } else if(item == '<i class="bx bxl-sass fs-1"></i>'){
            technologyName = 'SASS'
        }

        let technology = Boolean(data.technologies[i])
        if (technology){
            technology = data.technologies[i]
            names.push(technology + technologyName)
        }

    }

    return names
}

const getTechnology = (data) => {

    if(data){
        return technology = data
    } else {
        return technology = null
    }

}

app.listen(port, function(){
    console.log(`Berjalan di port ${port}`)
})