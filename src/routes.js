const routes = require('express').Router()
const multer = require('multer')
const multerConfig = require('./config/multer')

const databaseinteractions = require('./database/database-interactions')

routes.get('/', async (req, res) => {

    const albums = await databaseinteractions.getData('SELECT * FROM albums')
    
    albums.forEach( albums => {
        albums.images_url = ((albums.images_url).split(','))
    })

   return res.render('index.html', { albums })
})

routes.post('/posts', multer(multerConfig).array('file'), async (req, res) => {  /* file é o nome do campo que vai conter meus arquivos*/ 
    const fields = req.body
    
    const compressingKeys =  (req.files).map( image => {
        return image.key
    })

    const compressingUrls =  (req.files).map( image => {
        return image.location
    })

    const name = fields.name
    const about = fields.about
    const keys = compressingKeys.toString()
    const urls = compressingUrls.toString()

    const date = new Date()

    const day = date.getDay() < 10? `0${date.getDay() + 1}` : date.getDay() + 1
    const month = date.getMonth() < 10?  `0${date.getMonth() + 1}` : date.getMonth() + 1
    const year = date.getFullYear()
    
    const hour = date.getHours()
    const minutes = date.getMinutes()
    
    const currentDate = `Dia ${day}/${month}/${year} as ${hour}:${minutes}`

    await databaseinteractions.insertData({
        name,
        about,
        currentDate,
        keys,
        urls
    })

    return res.redirect('/')
})

routes.delete('/delete/:id', async (req, res) => {
    const params = req.params
    const id = params.id


    try {
        const [ rows ] = await databaseinteractions.getData(`SELECT * FROM albums WHERE id= ${id}`)
        const album = rows
        
        await databaseinteractions.deleteData(album)
        
        res.redirect('/')
    } catch(e) {
        console.log(e)
    }



})


module.exports = routes