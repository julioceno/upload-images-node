require("dotenv").config()

const express = require('express') 
const morgan = require('morgan')
const nunjucks = require('nunjucks')
const path = require('path')

const app = express()

// configurando nunjucks
nunjucks.configure('src/view', {
    express: app,
    noCache: true
})

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(morgan('dev'))
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))) // usado para desenvolvimento

app.use(require("./routes"))

app.listen(3000) 

