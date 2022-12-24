const express = require('express')
const router = express.Router()
const urlShortener = require('../../urlShortener')
const Data = require('../../models/data')

//確認db中是否已有該網址的資訊
router.post('/', (req, res) => {
  let originalURL = req.body.url
  return Data.findOne({ 'originalURL': originalURL })
    .then((data) => {
      //該筆資料已存在db中
      if (data !== null) {
        //將原有資料叫出來
        let shortenURL = data.shortenURL
        return res.render('index', { shortenURL, originalURL })

        //該筆資料不存在db中
      } else {
        //新增該筆資料
        let shortenURL = urlShortener()
        return Data.create({ originalURL, shortenURL })
          .then(() => res.render('index', { shortenURL, originalURL }))
      }
    })
})

//使用產生的短網址連至指定網站
router.get('/:shortenURL', (req, res) => {
  let shortURL = req.params.shortenURL
  return Data.findOne({ 'shortenURL': `https://localhost:3000/${shortURL}` })
    .then((data) => {
      if (data !== null) {
        res.redirect(data.originalURL)
      } else {
        //沒有該筆資料的話轉至error page
        res.render('error', { shortURL })
      }
    })
})

module.exports = router