const express = require('express')
const handlebars = require('express-handlebars')
const socketServer = require('./utils/io');
const { Server } = require('socket.io')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const initializePassport = require('./config/passport')
const mongoDb = require('./dao/Db/mongoDb')
const settings = require('./commands/commands')



//inicializacion de la app
const app = express()

//conexion a la base de datos
mongoDb.getConnection(settings)

// Middleware para el manejo de JSON y datos enviados por formularios
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//middleware de cookie
app.use(cookieParser(settings.private_cookie))


//configuracion de session
app.use(session({
	store: MongoStore.create({
        mongoUrl: mongoDb.MONGODE_CONNECT,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 240,
    }),
  secret: settings.private_session,
  resave: true,
  saveUninitialized: true
}))

app.use(flash())
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

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



// Implementación de enrutadores
const cartsRouter = require('./routers/cartsRouter')
const productRouter = require('./routers/productsRoutes')
const viewsRouter = require('./routers/viewsRouter');
const sessionRouter =require('./routers/sessionRouter')

//rutas de enrutados
app.use('/api/products', productRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionRouter)
app.use('/', viewsRouter);

// Ruta de health check
app.get('/healthCheck', (req, res) => {
	res.json({
	  status: 'running',
	  date: new Date(),
	});
  });

module.exports = io