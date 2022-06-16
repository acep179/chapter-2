const express = require('express')
const app = express()
const port = 8000

app.set('view engine','hbs')
app.use('/assets', express.static('assets'))

app.listen(port, function(){
    console.log(`Berjalan di port ${port}`)
})

app.get('/', function(req,res){
    res.render('index')
})
app.get('/contact', function(req,res){
    res.render('contact')
})
app.get('/add-project', function(req,res){
    res.render('add-project')
})