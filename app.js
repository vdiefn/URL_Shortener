const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const urlShortener = require('./urlShortener')
const Data = require('./models/data')
const routes = require('./routes')


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
app.use(routes)


app.get('/', (req, res) => {
  res.render('index')
})


app.listen(port, () => {
  console.log( `Express is running on http://localhost:${port}`)
})