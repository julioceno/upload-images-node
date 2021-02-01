const connect = require('./db-config')

async function getData(path) {
   const conn = await connect()
   const [rows] = await conn.query('SELECT * FROM albums') 
   
   console.log(rows)
}

async function insertData(data) {
    const conn = await connect()

    let url = data.url 

    if (!url) {
        url = `${process.env.APP_URL}/files/${data.key}`
    }

    const sql = `INSERT INTO albums (name, keyAlbum, url ) VALUES (?,?,?)`
    const values = [data.name, data.key, url]
    
    conn.query(sql, values)
}

async function deleteData(id) {
    const conn = await connect()

    const sql = `DELETE from albums WHERE id = "?"`
    const value = [id]
    
    conn.query(sql, value)
}

module.exports = {
    getData, 
    insertData
}