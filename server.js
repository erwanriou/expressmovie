const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const mongoose = require('mongoose');
const faker = require('faker');

const config = require('./config');

const app = express()

//Database Connect
mongoose.connect(config.db.url(), config.db.options)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error: cannot connect to my DB'))
db.once('open', () => {
  console.log('connected to the DB')
})

//Database
const movieSchema = mongoose.Schema({
  movieTitle: String,
  movieYear: Number,
})
const Movie = mongoose.model('Movie', movieSchema)

//port
const PORT = 3001
let frenchMovies = []

//middlewares
app.use('/public', express.static('public'))
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const upload = multer()
const fakeUser = { email: 'testuser@testemail.fr', password: 'qwe'}
const secret = 'qwr1ewwvw15f1Aas1s24f65q1qwc1E3g15RRq1s2d165qw8r744q4asV18ff1q84Sca1a5sHH4q4gc1Vnfd87'
app.use(expressJwt({ secret: secret }).unless({ path: ['/login', '/movies', '/movies-search', '/']} ))

//view engines
app.set('views', './views')
app.set('view engine', 'ejs')

//routes
app.get('/movies', (req, res) => {
  const title = 'Films français des trente dernières annés'
  Movie.find((err, movies) => {
    if (err) {
      console.error('couldn\'t retreive the movies from DB')
      res.sendStatus(500)
    } else {
      console.log(movies);
      frenchMovies = movies;
      res.render('movies', { movies: frenchMovies, title: title })
    }
  })

})

app.post('/movies', upload.fields([]), (req, res) => {
  if (!req.body) {
    return res.sendStatus(500)
  } else {
    const formData = req.body
    console.log('formData: ', formData)
    const title = req.body.movieTitle
    const year = req.body.movieYear
    const myMovie = new Movie({ movieTitle: title, movieYear: year})
    myMovie.save((err, savedMovie) => {
      if (err) {
        console.error(err)
      } else {
        console.log(savedMovie)
        res.sendStatus(201)
      }
    })
  }
})
app.get('/movies/add', (req, res) => {
  res.send('Ajouter des films ici même')
})
app.get('/movies-search', (req, res) => {
  res.render('movies-search')
})
app.get('/login', (req, res) => {
  res.render('login', { title: 'Espace Membre'})
})
app.post('/login', urlencodedParser, (req, res) => {
  console.log('login post', req.body)
  if(!req.body) {
    res.sendStatus(500)
  } else {
    if( fakeUser.email === req.body.email &&
        fakeUser.password === req.body.password ) {
      const token = jwt.sign({iss: 'http://expressmovies.fr', user: 'Sam', role: 'moderator'}, secret)
      res.json(token)
    } else {
      res.sendStatus(401)
    }
  }
})
app.get('/movies/:id', (req, res) => {
  const id = req.params.id
  res.render('movies-details', { movieId: id })
})
app.get('/', (req, res) => {
  //res.send('Hello <b>Word<b/> !!!')
  res.render('index')
})
app.get('/member-only', (req, res) => {
  console.log(('req.user', req.user))
  res.send(req.user)
})
//listenning
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
