const express = require('express')

const cartsRouter = require('./routers/cartsRouter')
const productRouter = require('./routers/productsRoutes')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/api/products', productRouter)
app.use('/api/carts', cartsRouter)




app.listen(8080, () => {
  console.log('Servidor express escuchando en el puerto 8080')
})