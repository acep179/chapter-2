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
        startDateNumber: '2022-04-28',
        endDateNumber: '2022-05-30',
        startMonthName: 'Apr',
        endMonthName: 'Mei',
        startYearNumber: 2022,
        endYearNumber: 2022,
        monthDuration: 1,
        yearDuration: 0,
        description: 'Gudangku adalah sebuah aplikasi manajemen gudang berbasis web.',
        technologies: ["<i class='bx bxl-html5'></i>",
        "<i class='bx bxl-css3'></i>","<i class='bx bxl-javascript'></i>"],
        technologiesName: ['HTML','CSS','JavaScript'],
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

    let startDateNumber = ''
    let endDateNumber = ''

    let startMonthName = ''
    let endMonthName = ''

    let startYearNumber = ''
    let endYearNumber = ''

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
    }
    
    // . Techologies
    let technologies = []
    let technologiesName = []
    
    let html = Boolean(data.projectHTML)
    if (html){
        html = data.projectHTML
        technologies.push(html)
        technologiesName.push('HTML')
    }
    
    let css = Boolean(data.projectCSS)
    if (css){
        css = data.projectCSS
        technologies.push(css)
        technologiesName.push('CSS')
    }
    
    let js = Boolean(data.projectJS)
    if (js){
        js = data.projectJS
        technologies.push(js)
        technologiesName.push('JavaScript')
    }
    
    let tailwind = Boolean(data.projectTailwind)
    if (tailwind){
        tailwind = data.projectTailwind
        technologies.push(tailwind)
        technologiesName.push('TailwindCSS')
    }
    
    let sass = Boolean(data.projectSASS)
    if (sass){
        sass = data.projectSASS
        technologies.push(sass)
        technologiesName.push('SASS')
    }
    
    //. Image

    let image = data.projectImage
    // image = URL.createObjectURL(image[0])

    getTime(startDate,endDate)
    getDateName(startDate,endDate)

    //. Set Project Form
    let setProjectForm = {
        name,
        startDateNumber,
        endDateNumber,
        startMonthName,
        endMonthName,
        startYearNumber,
        endYearNumber,
        monthDuration,
        yearDuration,
        description,
        technologies,
        technologiesName,
        image,
        isLogin
    }

    dataProject.push(setProjectForm)
    res.redirect('/#myProject')
})

/*
app.post('/add-project', function(req,res){
    
    let data = req.body
    
    data = {
        projectName: data.projectName,
        projectStartDate: data.projectStartDate,
        projectEndDate: data.projectEndDate,
        projectDescription: data.projectDescription,
        projectTechnologies: [data.projectHTML,data.projectCSS,data.projectJS, data.projectTailwind, data.projectSASS],
        isLogin
    }
    
    dataProject.push(data)
    res.redirect('/#myProject')
})*/

//. Menampilkan Project + Render Home

app.get('/', function(req,res){

    console.log(dataProject)

    // console.log(dataProject)
    res.render('index',{isLogin,dataProject})

})



app.listen(port, function(){
    console.log(`Berjalan di port ${port}`)
})