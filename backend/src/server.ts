import express from 'express'
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/de', (req, res) => {
  res.send('Bro this is deployed!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
