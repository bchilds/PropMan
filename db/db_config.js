const { Pool, Client } = require('pg')

// pools will use environment variables
// for connection information
console.log(process.env.PGDATABASE)
const pool = new Pool()
   
module.exports = {
	query: (text, params) => pool.query(text, params)
}
