/*
    Puerto
*/
// PORT es la variable que heroku actualiza por nosotros, pero si no existe, entonces el process.env sera el puerto 3000
process.env.PORT = process.env.PORT || 3000

/*
    ENTORNO
*/

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

let urlDB

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB