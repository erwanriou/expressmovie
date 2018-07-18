const express = require('express')
const app = express()

//port
const PORT = 3001

//middlewares
app.use('/public', express.static('public'))

//view engines
app.set('views', './views')
app.set('view engine', 'ejs')

//routes
app.get('/movies', (req, res) => {
  const title = 'Films français des trente dernières annés'
  const frenchMovies = [
    { title: 'Le fabuleux destin d\'Amélie Poulain', year: 2001},
    { title: 'Buffet froid', year: 1979},
    { title: 'Le diner de cons', year: 1998},
    { title: 'De rouille et d\'os', year: 2012},
  ]
  res.render('movies', { movies: frenchMovies, title: title })
})
app.get('/movies/add', (req, res) => {
  res.send('Ajouter des films ici même')
})
app.get('/movies/:id', (req, res) => {
  const id = req.params.id
  res.render('movies-details', { movieId: id })
})
app.get('/', (req, res) => {
  //res.send('Hello <b>Word<b/> !!!')
  res.render('index')
})

//listenning
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
