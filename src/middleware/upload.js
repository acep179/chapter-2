const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req,res,cb){
        cb(null, 'assets/img/project')
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload =  multer({storage})
module.exports = upload