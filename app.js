const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const urlShortener = require('./urlShortener')
const Data = require('./models/data')


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = 3000
const db = mongoose.connection

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('handlebars', exphbs({defaultLayout : 'main'}))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.urlencoded({ extended: true}))

app.get('/', (req, res) => {
  res.render('index')
})

//確認db中是否已有該網址的資訊
app.post('/', (req, res) => {
  let originalURL = req.body.url
  
  console.log('req.body:', originalURL)
  
  return Data.findOne({ 'originalURL': originalURL })
    .then((data)=>{
      //該筆資料已存在db中
      if (data !== null) {
        console.log('already had!')
        console.log('find:', data)
        //將原有資料叫出來
        let shortenURL = data.shortenURL
        return res.render('index', { shortenURL: shortenURL, originalURL: originalURL })
      //該筆資料不存在db中
      } else {
        console.log('add to db!')
        //新增該筆資料
        let shortenURL = urlShortener()
        return Data.create({ originalURL, shortenURL })
        .then(() => res.render('index', { shortenURL: shortenURL, originalURL: originalURL }))
      }
      })
    })
    
//使用產生的短網址連至指定網站
app.get('/:shortenURL', (req, res) => {
  let shortURL = req.params.shortenURL
  console.log('shortURL:', shortURL)
  return Data.findOne({ 'shortenURL': `https://localhost:3000/${shortURL}`})
    .then((data) => {
      if (data !== null) {
        console.log('find the data:', data)
        console.log('originalURL:', data.originalURL)
        res.redirect(data.originalURL)
      } else {
        console.log('error')
      }
     
    })
})

app.listen(port, () => {
  console.log( `Express is running on http://localhost:${port}`)
})