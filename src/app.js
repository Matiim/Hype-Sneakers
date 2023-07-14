const express = require('express')
const handlebars = require('express-handlebars')
const socketServer = require('./utils/io');
const app = express()


//middleware 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//configuracion de handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//MIDDLEWARE DE STATICOS
app.use(express.static('public'))

const cartsRouter = require('./routers/cartsRouter')
const productRouter = require('./routers/productsRoutes')
const viewsRouterFn = require('./routers/viewsRouter');

// Crear el servidor HTTP
const httpServer = app.listen(8080, () => {
	console.log(`Servidor express escuchando en el puerto 8080`);
  });

  // Crear el objeto `io` para la comunicación en tiempo real
const io = socketServer(httpServer);

// Crear las rutas de vistas y pasar el objeto `io` a `viewsRouterFn`
const viewsRouter = viewsRouterFn(io);

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

