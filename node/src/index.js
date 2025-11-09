import express from 'express'
import mysql from 'mysql2/promise'

const app = express()
const port = 3000

const dbConfig = {
  host: 'mysql',
  user: 'root',
  password: 'root',
  database: 'node'
}
const dbConnection =  await mysql.createConnection(dbConfig)

const createTable = async (connection) => {
  const sql = `CREATE TABLE IF NOT EXISTS people (
    id int AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
  )
`
  await connection.query(sql)
}

const insertUser = async (connection) => {
  const insert = `INSERT INTO people(name) VALUES('user')`
  await connection.query(insert)
}

const queryAllPeople = async (connection)  => {
  try {
    const sql = 'SELECT * FROM people';
    const [result] = await connection.query(sql)
    return result
  } catch (err) {
    console.error(err);
    return []
  }
}

app.get('/', async (req, res) => {
  await insertUser(dbConnection)
  const people = await queryAllPeople(dbConnection)
  let html = '<h1>Full Cycle Rocks</h1>'
  html += '<ul>'
  for (const p of people) {
    html += `<li>${p.id} - ${p.name}</li>`
  }
  html += '</ul>'

  res.send(html)
})

app.listen(port, async () => {
  console.log('Running on port', port)
  await createTable(dbConnection)
})
