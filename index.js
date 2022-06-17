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


//. Add Project

let dataProject = [
    {
        projectName: 'Gudangku',
        projectStartDate: '',
        projectEndDate: '',
        projectDescription: ''
    }
]

app.post('/add-project', function(req,res){
    
    let data = req.body
    
    data = {
        projectName: data.projectName,
        projectStartDate: data.projectStartDate,
        projectEndDate: data.projectEndDate,
        projectDescription: data.projectDescription
    }
    
    dataProject.push(data)
    res.redirect('/#myProject')
})

//. Menampilkan Project + Render Home

app.get('/', function(req,res){

    console.log(dataProject);

    res.render('index')
})



app.listen(port, function(){
    console.log(`Berjalan di port ${port}`)
})