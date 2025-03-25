const express = require('express')
const app = express()
const db = require('./connection')
const bodyParser = require("body-parser")

const port = 5000
app.use(bodyParser.json())

app.get('/', (req, res) => {
    db.query("SELECT * FROM book", (err, result) => {
        res.send(result)
    })
})

app.post('/book', (req, res) => {
    const {title, writer, price} = req.body
    const sql = `INSERT INTO book (title, writer, price) VALUES ('${title}', '${writer}', '${price}')`
    db.query(sql, (err, result) => {
        res.send(result)
    })
})

app.put('/book', (req, res) => {
    const {id, title, writer, price} = req.body
    const sql = `UPDATE book SET title = '${title}', writer = '${writer}', price = '${price}' WHERE id = ${id}`
    db.query(sql, (err, result) => {
        res.send(result)
    })
})

app.delete('/book/', (req, res) => {
    const {id} = req.body
    const sql = `DELETE FROM book WHERE id = '${id}'`
    db.query(sql, (err, result) => {
        res.send(result)
    })
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})