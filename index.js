const express = require('express')
const cors = require('cors')
const axios = require('axios')
const cheerio = require('cheerio')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const nodemon = require('nodemon')

const url = 'https://kimetsu-no-yaiba.fandom.com/wiki/Kimetsu_no_Yaiba_Wiki'

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
// GET ALL CHARACTER 
app.get('/v1', (req, resp) => {
    const thumnails = []
    try {
        axios(url).then((res) => {
            const html = res.data;
            const $ = cheerio.load(html);
            $(".portal", html).each(function() {
                const name = $(this).find("a").attr("title");
                const url = $(this).find("a").attr("href");
                const img = $(this).find("a > img ").attr("data-src")
                
                thumnails.push({
                    name: name,
                    url: "http://localhost:8000/v1" + url.split("/wiki")[1],
                    img: img
                })
            })
            resp.status(200).json(thumnails);
        })
    } catch (err) {
        resp.status(500).json(err);
    }
})

// PORT
app.listen(8000, () => {
    console.log('...server is running')
})