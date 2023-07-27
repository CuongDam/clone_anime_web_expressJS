const express = require('express')
const cors = require('cors')
const axios = require('axios')
const cheerio = require('cheerio')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const nodemon = require('nodemon')


// SET UP PROJECT
const app = express()
app.use(express());
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors())
dotenv.config()
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}))

// ROUTES
app.get('/v1', (req, resp) => {
    resp.send('Hello anime')
})

// PORT
app.listen(8000, () => {
    console.log('...server is running')
})