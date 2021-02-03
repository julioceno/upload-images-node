require("dotenv").config()

const express = require('express') 
const morgan = require('morgan')
const nunjucks = require('nunjucks')
const path = require('path')
const methodoverride = require('method-override')

const app = express()

// configurando nunjucks
nunjucks.configure('src/view', {
    express: app,
    noCache: true
})

app
    .use(express.urlencoded({extended: true}))
    .use(express.static('public'))
    .use(morgan('dev'))
    .use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))) // usado para desenvolvimento
    .use(methodoverride('_method'))

    .use(require("./routes"))

    .listen(3000) 

