const express = require('express')
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const flash = require('connect-flash')
const mongoDb = require('./DAOs/mongo/Db/mongoDb')
const socketServer = require('./utils/socket');
const initializePassport = require('./config/passport')
const settings = require('./commands/commands')
const errorMiddleware = require('./middlewares/errorMiddleware')
const addLogger = require('./utils/logger')


//inicializacion de la app
const app = express()

//conexion a la base de datos
mongoDb.getConnection(settings)

app.use(addLogger)

// Middleware para el manejo de JSON y datos enviados por formularios
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//middleware de cookie
app.use(cookieParser(settings.private_cookie))


app.use(flash())
initializePassport()
app.use(passport.initialize())


//configuracion de handlebars
app.engine('handlebars', handlebars.engine())
app.set('views',__dirname + '/views')
app.set('view engine', 'handlebars')

//carpeta public
app.use(express.static(__dirname +'/public'))

// Crear el servidor HTTP
const httpServer = app.listen(8080, () => {
	console.log(`Servidor express escuchando en el puerto 8080`);
  });

// io para la comunicacion en tiempo real
const io = new Server(httpServer);
socketServer(io);

// Ruta de health check
app.get('/healthCheck', (req, res) => {
	res.json({
	  status: 'running',
	  date: new Date(),
	});
  });

app.get('/loggerTest', (req, res) => {
    req.logger.debug('Prueba de desarrollo')
    req.logger.info('Prueba de producción en consola')
    req.logger.error('Prueba en producción de log en archivo')

    res.send({ message: 'Prueba de logger!' })
})


// Implementación de enrutadores
const productRouter = require('./routers/productsRoutes')
const cartsRouter = require('./routers/cartsRouter')
const viewsRouter = require('./routers/viewsRouter');
const sessionRouter =require('./routers/sessionRouter')


//rutas de enrutados
app.use('/api/products', productRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionRouter)
app.use('/', viewsRouter);


app.use(errorMiddleware)

module.exports = io