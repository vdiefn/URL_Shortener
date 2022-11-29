const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const routes = require('./routes')
require('./config/mongoose')

const app = express()
const port = 3000

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