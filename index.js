const express = require('express')
const cors = require('cors')
const axios = require('axios')
const cheerio = require('cheerio')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const nodemon = require('nodemon')

const url = 'https://kimetsu-no-yaiba.fandom.com/wiki/Kimetsu_no_Yaiba_Wiki'
const characterUrl = 'https://kimetsu-no-yaiba.fandom.com/wiki/'

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
    const thumnails = [];
    const limit = Number(req.query.limit);
    try {
        axios(url).then((res) => {
            const html = res.data;
            const $ = cheerio.load(html);
            $(".portal", html).each(function() {
                const name = $(this).find("a").attr("title");
                const url = $(this).find("a").attr("href");
                const img = $(this).find("a > img ").attr("data-src");
                
                thumnails.push({
                    name: name,
                    url: "http://localhost:8000/v1" + url.split("/wiki")[1],
                    img: img
                })
            })
            if(limit && limit > 0) {
                resp.status(200).json(thumnails.slice(0, limit))
            } else
                resp.status(200).json(thumnails);
        })
    } catch (err) {
        resp.status(500).json(err);
    }
})

    // GET A CHARACTER 
app.get("/v1/:character", (req, resp) => {
    //console.log(req.params)
    const inforCharacter = []
    const titles = []
    const details = []
    try {
        axios(characterUrl + req.params.character).then((res) => {
            const html = res.data;
            const $ = cheerio.load(html);

            // GET INFORMATION CHARACTER
            $("aside", html).each(function() {

                // GET TITLES INFOR CHARACTER
                $(this).find("section > div > h3").each(function() {
                    titles.push($(this).text());
                })

                // GET DETAILS INFOR CHARACTER
                $(this).find("section > div > div").each(function() {
                    details.push($(this).text());
                })
            })
        const characterInfor = titles.reduce((character, title, currentIndex) => {
            return {
                ...character, 
                [title]: details[currentIndex]
            }
        }, {})
        inforCharacter.push({...characterInfor})
        resp.status(200).json(inforCharacter)
        })
    } catch (err) {
        resp.status(500).json(err)
    }
})

    
// PORT
app.listen(8000, () => {
    console.log('...server is running')
})