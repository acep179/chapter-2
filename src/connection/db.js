const {Pool} = require('pg') //Pool tidak boleh diubah. Adapun Pool sendiri adalah sebuah properti atau function yang dimiliki oleh Postgre


const isProduction = process.env.NODE_ENV === "production"
let dbPool

if(isProduction){
    dbPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    })
} else {
    dbPool = new Pool({
        database: 'personal_web',
        port: 5432,
        user: 'postgres',
        password: 'Sekar218'
    })
}

module.exports = dbPool