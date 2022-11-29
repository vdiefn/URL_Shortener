const express = require('express')
const router = express.Router()
const urlShortener = require('../../urlShortener')
const Data = require('../../models/data')

//確認db中是否已有該網址的資訊
router.post('/', (req, res) => {
  let originalURL = req.body.url
  console.log('req.body:', originalURL)
  return Data.findOne({ 'originalURL': originalURL })
    .then((data) => {
      //該筆資料已存在db中
      if (data !== null) {
        console.log('already had!')
        console.log('find:', data)
        //將原有資料叫出來
        let shortenURL = data.shortenURL
        return res.render('index', { shortenURL, originalURL })

        //該筆資料不存在db中
      } else {
        console.log('add to db!')
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
  console.log('shortURL:', shortURL)
  return Data.findOne({ 'shortenURL': `https://localhost:3000/${shortURL}` })
    .then((data) => {
      if (data !== null) {
        console.log('find the data:', data)
        console.log('originalURL:', data.originalURL)
        res.redirect(data.originalURL)
      } else {
        //沒有該筆資料的話轉至error page
        console.log('error')
        res.render('error', { shortURL })
      }

    })
})

module.exports = router