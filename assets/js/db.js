const {Pool} = require('pg') //Pool tidak boleh diubah. Adapun Pool sendiri adalah sebuah properti atau function yang dimiliki oleh Postgre

const dbPool = new Pool({
    database: 'personal_web',
    port: 5432,
    user: 'postgres',
    password: 'Sekar218'
})

module.exports = dbPool