const routes = require('express').Router()
const multer = require('multer')
const multerConfig = require('./config/multer')

const databaseinteractions = require('./database/database-interactions')

routes.get('/', (req, res) => {
   return res.render('index.html')
})

routes.post('/posts', multer(multerConfig).single('file'), async (req, res) => {  /* file é o nome do campo que vai conter meus arquivos*/ 
    const fields = req.body
    
    const {originalname: name, key, location: url = ""} = req.file
    
    await databaseinteractions.insertData({
        name,
        key,
        url
    })

    return res.redirect('/')
})


module.exports = routes