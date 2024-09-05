const express = require('express')
const { Client } = require('pg');

const conexao = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '123456',
  database: 'crud_produtos'
}

const app = express()
const port = 3000

app.use(express.json());

const produtos = [
  { id: 1, nome: "feijao", preco: 10, categoria: "alimento" },
  { id: 2, nome: "arroz", preco: 8, categoria: "alimento" },
  { id: 3, nome: "suco de laranja", preco: 12, categoria: "bebida" },
];

app.get('/', (req, res) => {
  res.send("Hello World!");
})

app.get('/produtos', async (req, res) => {
  const client = new Client(conexao);
  await client.connect();

  const result = await client.query(
    "SELECT * FROM PRODUTOS"
  );
  const listaProdutos = result.rows;
  await client.end();
  res.json(listaProdutos);
})

app.get('/produtos/:id', async (req, res) => {
  const id = req.params.id;

  const client = new Client(conexao);
  await client.connect();
  const result = await client.query(
    "SELECT * FROM PRODUTOS WHERE id=$1", [id]
  );
  const produto = result.rows[0];
  await client.end();

  if (produto) {
    res.json(produto);
  }
  else {
    res.status(404)
      .json({ erro: "Produto nao encontrado" });
  }
})


app.post('/produtos', async (req, res) => {
  const produto = req.body;

  if (!produto || !produto.nome || !produto.categoria
    || !produto.preco) {
    res.status(400).json(
      { erro: "Informacoes de produto incompletas!" })
  }
  else {
    const client = new Client(conexao);
    await client.connect();
    const result = await client.query(
      `INSERT INTO PRODUTOS (nome, categoria, preco) 
      VALUES ($1, $2, $3) RETURNING *`,
      [produto.nome, produto.categoria, produto.preco]
    );
    const produtoInserido = result.rows[0];
    await client.end();

    res.status(201).json(produtoInserido);
  }
})

app.put('/produtos/:id', async (req, res) => {
  const id = req.params.id;
  const produto = req.body;

  if (!produto || !produto.nome || !produto.categoria
    || !produto.preco) {
    res.status(400).json(
      { erro: "Informacoes de produto incompletas!" })
  }
  else {
    const client = new Client(conexao);
    await client.connect();
    const result = await client.query(
      `UPDATE PRODUTOS
      SET nome=$1, categoria=$2, preco=$3
      WHERE id=$4 RETURNING *`,
      [produto.nome, produto.categoria, produto.preco, id]
    );
    const produtoAtualizado = result.rows[0];
    await client.end();

    if (produtoAtualizado) {
      res.json(produtoAtualizado);
    }
    else {
      res.status(404)
        .json({ erro: "Produto nao encontrado" });
    }
  }

})

app.delete('/produtos/:id', async (req, res) => {
  const id = req.params.id;

  const client = new Client(conexao);
  await client.connect();
  const result = await client.query(
    "DELETE FROM PRODUTOS WHERE id=$1 RETURNING *", [id]
  );
  const produtoDeletado = result.rows[0];
  await client.end();

  if (produtoDeletado) {
    res.json(produtoDeletado);
  }
  else {
    res.status(404)
      .json({ erro: "Produto nao encontrado" });
  }

})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

