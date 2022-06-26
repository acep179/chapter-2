const express = require('express')
const app = express()

const db = require('./assets/js/db')

const multer = require('multer')
const { query } = require('express')
const upload = multer({dest: 'assets/img/project'})
    
const port = 8000

app.set('view engine','hbs')
app.use('/assets', express.static('assets'))
app.use(express.urlencoded({extended: false}))

let isLogin = true

//. Rendering
app.get('/contact', function(req,res){
    res.render('contact', {isLogin})
})
app.get('/add-project', function(req,res){
    res.render('add-project',{isLogin})
})
app.get('/register', function(req,res){
    res.render('register',{isLogin})
})
app.get('/login', function(req,res){
    res.render('login',{isLogin})
})

//! Render Home sudah sekalian dengan Menampilkan Project di bawah


//. Database Connect

db.connect(function(err,client,done){
    if(err) throw err

    //. Register

    app.post('/register', function (req,res,next) {
        
        let data = req.body
        console.log(data)

        const query = `INSERT INTO tb_user(name, email, password)
        VALUES ('${data.userName}','${data.userEmail}','${data.userPassword}');`

        client.query(query, function(err, result){
            if(err) throw err
            
            res.redirect('/#myProject')
        })
    })

    //. Login



    //. Add Project

    app.post('/add-project', upload.single("projectImage"), function (req,res,next) {
        
        let data = req.body
        let html = getTechnology(data.projectHTML)
        let css = getTechnology(data.projectCSS)
        let js = getTechnology(data.projectJS)
        let tailwind = getTechnology(data.projectTailwind)
        let sass = getTechnology(data.projectSASS)
        
        const query = `INSERT INTO tb_project(name, start_date, end_date, description, technologies, image)
        VALUES ('${data.projectName}','${data.projectStartDate}','${data.projectEndDate}', '${data.projectDescription}','{${html},${css},${js},${tailwind},${sass}}','${req.file.path}');`

        client.query(query, function(err, result){
            if(err) throw err
            
            res.redirect('/#myProject')
        })
    })

    //. Edit Project

    app.get('/edit-project/:index', function(req,res){

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

            res.render('edit-project', {isLogin, index, data, html, css,js, tailwind,sass,startDate,endDate})
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

        client.query('SELECT * FROM tb_project ORDER BY id asc', function(err,result){
            if(err) throw err
            let data = result.rows.map(function(item){
                return {
                    ...item,
                yearDuration: getYearDuration(item.start_date,item.end_date),
                monthDuration: getMonthDuration(item.start_date,item.end_date),
                descriptionShort: item.description.slice(0,90),
                isLogin
                }
            })
            
            res.render('index',{isLogin,projects: data})
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

                res.render('project-detail',{isLogin, projects: data, shortStartDate, shortEndDate, yearDuration, monthDuration, technologiesName})
                })
                
            })

    //. Menghapus Project

    app.get('/delete-project/:index', function(req,res) {
        let index = req.params.index
        client.query(`DELETE FROM tb_project WHERE id=${index}`, function(err,result){
            if(err) throw err
            res.redirect('/#myProject')
        })
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