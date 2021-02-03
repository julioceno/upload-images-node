const connect = require('./db-config')
const aws = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')


const s3 = new aws.S3()

async function getData(path) {
   const conn = await connect()
   const [rows] = await conn.query(path) 
   
    return rows
}

async function insertData(album) {
    const conn = await connect()

    let {urls, keys, name} = album 
    
    
    if (!(urls.replace(/,/g , ''))) {

        urls = keys.split(',')

        urls = urls.map( key => {
           return `${process.env.APP_URL}/files/${key}`
        }) 

        urls = urls.toString()
    }

    const sql = `INSERT INTO albums (name, about, date, images_key, images_url ) VALUES (?, ?, ?, ?, ?)`
    const values = [album.name, album.about, album.currentDate, album.keys, urls]
    
    conn.query(sql, values)
}


async function deleteData(album) {
    const conn = await connect()

    let {id, images_key} = album

    images_key = images_key.split(',')

    const sql = `DELETE from albums WHERE id = "?"`
    const value = [id]
    
    if (process.env.STORAGE_TYPE === 's3') {
        images_key.forEach(key => {
            s3.deleteObject({
                Bucket:"upload-albums",
                Key: key,
            }).promise();
        })
    } else {
        images_key.forEach(key => {
            promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', key))
        })
    }
    
    conn.query(sql, value)
}

module.exports = {
    getData, 
    insertData,
    deleteData
}