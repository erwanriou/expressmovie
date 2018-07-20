const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const app = express()
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const mongoose = require('mongoose');
const faker = require('faker');

//Database Connect
const dbUser = 'erwan'
const dbPass = '17401985illidan'
const dbUrl = `mongodb://${dbUser}:${dbPass}@ds245661.mlab.com:45661/expressmovie`
const options = {
  useNewUrlParser: true,
}

mongoose.connect(dbUrl, options)
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

//TERMINATOR
const title = faker.lorem.sentence(3)
const year = Math.floor(Math.random() * 80) + 1950
const myMovie = new Movie({movieTitle: title, movieYear: year})
myMovie.save((err, savedMovie) => {
  if (err) {
    console.error(err);
  } else {
    console.log('savedMovie', savedMovie);
  }
})

//port
const PORT = 3001
let frenchMovies = []

//middlewares
app.use('/public', express.static('public'))
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const upload = multer()
const fakeUser = { email: 'testuser@testemail.fr', password: 'qwe'}
const secret = 'qwr1ewwvw15f1Aas1s24f65q1qwc1E3g15RRq1s2d165qw8r744q4asV18ff1q84Sca1a5sHH4q4gc1Vnfd87'
app.use(expressJwt({ secret: secret }).unless({ path: ['/login', '/movies', '/movies-search']} ))

//view engines
app.set('views', './views')
app.set('view engine', 'ejs')

//routes
app.get('/movies', (req, res) => {
  const title = 'Films français des trente dernières annés'
  frenchMovies = [
    { title: 'Le fabuleux destin d\'Amélie Poulain', year: 2001},
    { title: 'Buffet froid', year: 1979},
    { title: 'Le diner de cons', year: 1998},
    { title: 'De rouille et d\'os', year: 2012},
  ]
  res.render('movies', { movies: frenchMovies, title: title })
})

app.post('/movies', upload.fields([]), (req, res) => {
  if (!req.body) {
    return res.sendStatus(500)
  } else {
    const formData = req.body
    console.log('formData: ', formData)
    const newMovies = { title : req.body.movieTitle, year: req.body.movieYear}
    frenchMovies = [...frenchMovies, newMovies]
    res.sendStatus(201)
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
