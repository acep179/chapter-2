const express = require('express')
const app = express()
const port = 8000

app.set('view engine','hbs')
app.use('/assets', express.static('assets'))
app.use(express.urlencoded({extended: false}))

//. Rendering
app.get('/contact', function(req,res){
    res.render('contact')
})
app.get('/add-project', function(req,res){
    res.render('add-project')
})
//! Render Home sudah sekalian dengan Menampilkan Project di bawah

let isLogin = true


//. Add Project

let dataProject = [
    {
        name: 'Gudangku',
        shortStartDate: '28 Apr 2022',
        shortEndDate: '30 Mei 2022',
        monthDuration: 1,
        yearDuration: 0,
        descriptionShort: `Gudangku adalah sebuah aplikasi manajemen gudang berbasis web. Karena`,
        description: 'Gudangku adalah sebuah aplikasi manajemen gudang berbasis web. Karena berbasis web, aplikasi manajemen gudang dapat digunakan kapan pun dan di mana pun menggunakan perangkat apapun. Baik menggunakan komputer, laptop, tablet, mapun smartphone. Tentu saja, hal ini sangat memudahkan bagi pemilik bisnis sehingga tidak perlu khawatir ketika sedang ada keperluan di luar kantor.',
        technologies: ["<i class='bx bxl-html5'></i>",
        "<i class='bx bxl-css3'></i>","<i class='bx bxl-javascript'></i>"],
        technologiesName: ["<i class='bx bxl-html5 fs-1'></i> HTML", "<i class='bx bxl-css3 fs-1'></i> CSS", "<i class='bx bxl-javascript fs-1'></i> JavaScript"],
        image: './../assets/img/project/gudangku.png',
        isLogin
    }
]

app.post('/add-project',function (req,res) {
    
    let data = req.body
    
    //. Name & Description
    let name = data.projectName
    let description = data.projectDescription
    
    //. Duration
    let startDate = data.projectStartDate
    let endDate = data.projectEndDate
    
    let monthDuration = ''
    let yearDuration = ''

    let shortStartDate = ''
    let shortEndDate = ''

    const getTime = (startDate, endDate) => {
        startDate = new Date(startDate)
        endDate = new Date(endDate)
        
        let getMiliSecond = endDate - startDate
        
        let getYearDuration = Math.floor(getMiliSecond/1000/60/60/24/365)
        let getMonthDuration = Math.floor(getMiliSecond/1000/60/60/24/30)-(getYearDuration*12)
        
        if(getMonthDuration > 0){
            monthDuration = `${getMonthDuration}`
        }
        
        if(getYearDuration > 0){
            yearDuration = `${getYearDuration}`
        }
    }
    
    const getDateName = (startDate,endDate) => {
        startDate = new Date(startDate)
        endDate = new Date(endDate)
        
        let monthArr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Agt','Sep','Okt','Nov','Dec']
        
        let getStartMonth = startDate.getMonth()
        startMonthName = monthArr[getStartMonth]

        let getEndMonth = endDate.getMonth()
        endMonthName = monthArr[getEndMonth]

        startYearNumber = startDate.getFullYear()
        endYearNumber = endDate.getFullYear()

        startDateNumber = startDate.getDate()
        endDateNumber = endDate.getDate()

        shortStartDate = `${startDateNumber} ${startMonthName} ${startYearNumber}`
        shortEndDate = `${endDateNumber} ${endMonthName} ${endYearNumber}`
    }
    
    // . Techologies
    let technologies = []
    let technologiesName = []
    
    let html = Boolean(data.projectHTML)
    if (html){
        html = data.projectHTML
        technologies.push(html)
        technologiesName.push(`${html} HTML`)
    }
    
    let css = Boolean(data.projectCSS)
    if (css){
        css = data.projectCSS
        technologies.push(css)
        technologiesName.push(`${css} CSS`)
    }
    
    let js = Boolean(data.projectJS)
    if (js){
        js = data.projectJS
        technologies.push(js)
        technologiesName.push(`${js} JavaScript`)
    }
    
    let tailwind = Boolean(data.projectTailwind)
    if (tailwind){
        tailwind = data.projectTailwind
        technologies.push(tailwind)
        technologiesName.push(`${tailwind} TailwindCSS`)
    }
    
    let sass = Boolean(data.projectSASS)
    if (sass){
        sass = data.projectSASS
        technologies.push(sass)
        technologiesName.push(`${sass} SASS`)
    }
    
    //. Image

    let image = data.projectImage

    getTime(startDate,endDate)
    getDateName(startDate,endDate)

    //. Set Project Form
    let setProjectForm = {
        name,
        shortStartDate,
        shortEndDate,
        monthDuration,
        yearDuration,
        descriptionShort: description.slice(0,70),
        description,
        technologies,
        technologiesName,
        image,
        isLogin
    }

    dataProject.push(setProjectForm)
    res.redirect('/#myProject')
})


//. Menampilkan Project + Render Home

app.get('/', function(req,res){

    // console.log(dataProject)
    res.render('index',{isLogin,dataProject})

})

//.  Menampilkan Detail Project Berdasarkan ID

app.get('/project-detail/:index', function(req,res){

    let index = req.params.index

    let project = dataProject[index]

    res.render('project-detail',project)
})

app.listen(port, function(){
    console.log(`Berjalan di port ${port}`)
})