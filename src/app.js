const express = require('express')
const mongoose = require('mongoose')
const handlebars = require('express-handlebars')
const socketServer = require('./utils/io');
const { Server } = require('socket.io')


const app = express()

//conexion a la base de datos
const MONGODE_CONNECT = 'mongodb+srv://matimartinezz927:Agosto92@cluster0.1dpefja.mongodb.net/ecommerce?retryWrites=true&w=majority'
mongoose.connect(MONGODE_CONNECT)
	.catch (err =>{
	if(err){
		console.log('No se pudo conectar a la base de datos', err)
		process.exit()
	}

})


// Middleware para el manejo de JSON y datos enviados por formularios
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//configuracion de handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// Seteo de forma estática la carpeta public
app.use(express.static('public'))

// Implementación de enrutadores
const cartsRouter = require('./routers/cartsRouter')
const productRouter = require('./routers/productsRoutes')
const viewsRouter = require('./routers/viewsRouter');

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
app.use('/', viewsRouter);

// Ruta de health check
app.get('/healthCheck', (req, res) => {
	res.json({
	  status: 'running',
	  date: new Date(),
	});
  });

module.exports = io