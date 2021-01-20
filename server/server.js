require('./config/config.js')

const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyparser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyparser.json())

app.use(require('./routes/usuario.js'))

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err

    console.log('Base de datos online')
})

app.listen(process.env.PORT, () => console.log('Listening...', process.env.PORT))