const express = require('express')
const app = express()

//port
const PORT = 3001

//routes
app.get('/movies', (req, res) => {
  res.send('Bientot des films ici meme')
})
app.get('/movies/add', (req, res) => {
  res.send('Ajouter des films ici même')
})
app.get('/movies/:id', (req, res) => {
  const id = req.params.id
  res.send(`film numéro ${id}`)
})
app.get('/', (req, res) => {
  res.send('Hello Word !!!')
})

//listenning
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
