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

//! Render Home sudah sekalian dengan Menampilkan Project di bawah

//. Add Project

app.post('/add-project', upload.single("projectImage"), function (req,res,next) {
    
    let data = req.body
    res.redirect('/#myProject')
})

//. Edit Project

app.get('/edit-project/:index', function(req,res){

    let index = req.params.index

        
    res.render('edit-project', {isLogin, index})
})

app.post('/edit-project/:index', upload.single("projectImage"), function (req,res) {
    
    let index = req.params.index

    let data = req.body
    
    let html = getTechnology(data.projectHTML)
    let css = getTechnology(data.projectCSS)
    let js = getTechnology(data.projectJS)
    let tailwind = getTechnology(data.projectTailwind)
    let sass = getTechnology(data.projectSASS)    
        
    res.redirect('/#myProject')
})

//. Menampilkan Project + Render Home

app.get('/', function(req,res){

    db.connect(function(err,client,done){
        if(err) throw err
        client.query('SELECT * FROM tb_project', function(err,result){
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
})
    

//.  Menampilkan Detail Project Berdasarkan ID

app.get('/project-detail/:index', function(req,res){

    let index = req.params.index
    
    res.render('project-detail',{isLogin})
})

//. Menghapus Project

app.get('/delete-project/:index', function(req,res) {
    let index = req.params.index
    res.redirect('/#myProject')
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