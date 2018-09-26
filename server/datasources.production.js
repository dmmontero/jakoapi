module.exports = {
  jakods: {
    host: 'localhost',
    port: '3306',
    database: 'jakodb',
    password: process.env.MYSQL_PASS,
    name: 'jakods',
    user: 'root',
    connector: 'mysql',
  }
}
