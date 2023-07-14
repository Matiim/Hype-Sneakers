const { Server } = require('socket.io')
const ProductManager = require('../controllers/productManager');

const init = (httpServer) => {
  const io = new Server(httpServer)
  const productManager = new ProductManager('./src/products.json', io)
  io.on('connection', socket => {
    console.log('Nuevo cliente conectado', socket.id)

    socket.on('addProduct', async productData => {
      const product = JSON.parse(productData);
      try {
        await productManager.addProduct(product);
        socket.emit( 'El producto fue agregado con éxito');
      } catch (error) {
        socket.emit( error.message)
      }
    });

    socket.on('deleteProduct', async productId => {
      try {
        await productManager.deleteProduct(productId);
        socket.emit( 'El producto fue borrado con éxito');
      } catch (error) {
        socket.emit( error.message)
      }
    });
  })
  //servidor io
  return io
}

module.exports = init