const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/produtos', (req, res) => {
    res.send('Listar Produtos!')
})

app.get('/produtos/:id', (req, res) => {
  res.send('Buscar produto por id!')
})

  
app.post('/produtos', (req, res) => {
  res.send('Inserir Produto!')
})

app.put('/produtos/:id', (req, res) => {
  res.send('Atualizar produto!')
})

app.delete('/produtos/:id', (req, res) => {
  res.send('Deletar produto!')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

