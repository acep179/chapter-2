const express = require('express')
const app = express()

// const db = require('./assets/js/db')

const multer = require('multer')
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
app.get('/edit-project/:index', function(req,res){

    let index = req.params.index
    let data = dataProject[index]
    let html = data.technologies[0]
    let css = data.technologies[1]
    let js = data.technologies[2]
    let tailwind = data.technologies[3]
    let sass = data.technologies[4]
    res.render('edit-project', {isLogin, index, data, html, css,js, tailwind,sass})
})
//! Render Home sudah sekalian dengan Menampilkan Project di bawah


//. Add Project

let dataProject = [
    {
        name: 'Gudangku',
        startDate: '2022-01-13',
        endDate: '2022-04-14',
        description: 'Gudangku adalah sebuah aplikasi manajemen gudang berbasis web. Karena berbasis web, aplikasi manajemen gudang dapat digunakan kapan pun dan di mana pun menggunakan perangkat apapun. Baik menggunakan komputer, laptop, tablet, mapun smartphone. Tentu saja, hal ini sangat memudahkan bagi pemilik bisnis sehingga tidak perlu khawatir ketika sedang ada keperluan di luar kantor.',
        technologies: ["<i class='bx bxl-html5 fs-1'></i>",
        "<i class='bx bxl-css3 fs-1'></i>","<i class='bx bxl-javascript fs-1'></i>",undefined,undefined],
        image: './../assets/img/project/gudangku.png',
        isLogin
    }
]

app.post('/add-project', upload.single("projectImage"), function (req,res,next) {
    
    let data = req.body
    
    //. Set Data 
    let name = data.projectName
    let description = data.projectDescription
    let startDate = data.projectStartDate
    let endDate = data.projectEndDate
    let technologies = [data.projectHTML,data.projectCSS,data.projectJS,data.projectTailwind,data.projectSASS]
    let image = req.file.path

    //. Set Project Form
    let setProjectForm = {
        name,
        startDate,
        endDate,
        description,
        technologies,
        image,
        isLogin
    }

    dataProject.push(setProjectForm)
    res.redirect('/#myProject')
})

//. Edit Project

app.post('/edit-project/:index', upload.single("projectImage"), function (req,res) {
    
    let index = req.params.index

    let data = req.body
    
    //. Set Data 
    let name = data.projectName
    let startDate = data.projectStartDate
    let endDate = data.projectEndDate
    let description = data.projectDescription
    let technologies = [data.projectHTML,data.projectCSS,data.projectJS,data.projectTailwind,data.projectSASS]
    let image = req.file.path
    
    //. Set Project Form
    let setProjectForm = {
        name,
        startDate,
        endDate,
        description,
        technologies,
        image,
        isLogin
    }

    dataProject.splice(index,1, setProjectForm)
    res.redirect('/#myProject')
})

//. Menampilkan Project + Render Home

app.get('/', function(req,res){

    // db.connect(function(err,client,done){
    //     if(err) throw err
    //     client.query('SELECT * FROM tb_user', function(err,result){
    //         if(err) throw err
    //         let data = result.rows
    //     })
    // })
    
    let data = dataProject.map(function(item){
        return {
            ...item,
        yearDuration: getYearDuration(item.startDate,item.endtDate),
        monthDuration: getMonthDuration(item.startDate,item.endDate),
        descriptionShort: item.description.slice(0,90)
        }
    })
    
    res.render('index',{isLogin,projects: data})

})

//.  Menampilkan Detail Project Berdasarkan ID

app.get('/project-detail/:index', function(req,res){

    let index = req.params.index
    let data = dataProject[index]
    
    let shortStartDate = getDateName(data.startDate)
    let shortEndDate = getDateName(data.endDate)
    let yearDuration = getYearDuration(data.startDate,data.endtDate)
    let monthDuration = getMonthDuration(data.startDate,data.endDate)
    let technologiesName = getTechnologiesName(data)
    
    res.render('project-detail',{isLogin, projects: data, shortStartDate, shortEndDate, yearDuration, monthDuration, technologiesName})
})

//. Menghapus Project

app.get('/delete-project/:index', function(req,res) {
    let index = req.params.index
    dataProject.splice(index, 1)
    res.redirect('/#myProject')
})

//. Functions

const getMonthDuration = (startDate, endDate) => {
    start = new Date(startDate)
    end = new Date(endDate)
    
    let getMiliSecond = end - start
    
    let setYearDuration = Math.floor(getMiliSecond/1000/60/60/24/365)
    let setMonthDuration = Math.floor(getMiliSecond/1000/60/60/24/30)-(setYearDuration*12)
    
    return setMonthDuration
}

const getYearDuration = (startDate, endDate) => {
    start = new Date(startDate)
    end = new Date(endDate)
    
    let getMiliSecond = end - start
    
    let setYearDuration = Math.floor(getMiliSecond/1000/60/60/24/365)
    
    if(setYearDuration > 0){
        return setYearDuration
    }
}

const getDateName = (date) => {
    date = new Date(date)
    
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

        if(item == "<i class='bx bxl-html5 fs-1'></i>"){
            technologyName = 'HTML'
        } else if(item == "<i class='bx bxl-css3 fs-1'></i>"){
            technologyName = 'CSS'
        } else if(item == "<i class='bx bxl-javascript fs-1'></i>"){
            technologyName = 'JavaScript'
        } else if(item == "<i class='bx bxl-tailwind-css fs-1'></i>"){
            technologyName = 'TailwindCSS'
        } else if(item == "<i class='bx bxl-sass fs-1'></i>"){
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

app.listen(port, function(){
    console.log(`Berjalan di port ${port}`)
})