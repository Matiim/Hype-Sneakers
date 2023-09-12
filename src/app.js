const express = require('express')
const mongoose = require('mongoose')
const handlebars = require('express-handlebars')
const socketServer = require('./utils/io');
const { Server } = require('socket.io')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const initializePassport = require('./config/passport')


const app = express()

//conexion a la base de datos
const MONGODE_CONNECT = 'mongodb+srv://matimartinezz927:Agosto92@cluster0.1dpefja.mongodb.net/ecommerce?retryWrites=true&w=majority'
mongoose.connect(MONGODE_CONNECT)
.then (async =>{
	console.log('conectado a la base de datos')
})

//middleware de cookie
app.use(cookieParser('secretkey'))

//configuracion de session
app.use(session({
	store:MongoStore.create({
		mongoUrl: MONGODE_CONNECT ,
		ttl: 240,
	}),
  secret: 'secretSession',
  resave: true,
  saveUninitialized: true
}))


app.use(flash())
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Middleware para el manejo de JSON y datos enviados por formularios
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//configuracion de handlebars
app.engine('handlebars', handlebars.engine())
app.set('views',__dirname + '/views')
app.set('view engine', 'handlebars')



//carpeta public
app.use(express.static(__dirname +'/public'))

// Implementación de enrutadores
const cartsRouter = require('./routers/cartsRouter')
const productRouter = require('./routers/productsRoutes')
const viewsRouter = require('./routers/viewsRouter');
const sessionRouter =require('./routers/sessionRouter')

// Crear el servidor HTTP
const httpServer = app.listen(8080, () => {
	console.log(`Servidor express escuchando en el puerto 8080`);
  });

// io para la comunicacion en tiempo real
const io = new Server(httpServer);
socketServer(io);

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