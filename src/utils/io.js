const ProductManagerMongo = require('../dao/ProductManagerMongo')
const MessageManagerMongo = require('../dao/MessageManagerMongo')
const CartManagerMongo = require('../dao/CartsManagerMongo')
const moment = require('moment')

const handleSocketConnection = (io) => {
	const productManagerMongo = new ProductManagerMongo(io);
	const messageManagerMongo = new MessageManagerMongo(io);
	const cartManagerMongo = new CartManagerMongo()
  
	io.on('connection', socket => {
	  console.log('Nuevo cliente conectado', socket.id)
  
	  socket.on('addProduct', async productData => {
		const product = JSON.parse(productData);
		try {
		  await productManagerMongo.addProduct(product);
		  socket.emit('notification', { message: 'Producto agregado con éxito', type: 'success' });
		} catch (error) {
		  socket.emit('notification', { message: error.message, type: 'error' });
		}
	  });
  
	  socket.on('updateProduct', async (productId, data) => {
		try {
		  await productManagerMongo.updateProduct(productId, data);
		  socket.emit('notification', { message: 'Producto actualizado exitósamente', type: 'success' });
		} catch (error) {
		  socket.emit('notification', { message: error.message, type: 'error' });
		}
	  });
  
	  socket.on('deleteProduct', async productId => {
		try {
		  await productManagerMongo.deleteProduct(productId);
		  socket.emit('notification', { message: 'Producto borrado con éxito', type: 'success' });
		} catch (error) {
		  socket.emit('notification', { message: error.message, type: 'error' });
		}
	  });
  
	  socket.on('joinChat', async (newUser) => {
		try {
		  socket.broadcast.emit('notification', `El usuario ${newUser} se unió al chat`);
  
		  const messages = await messageManagerMongo.getMessages();
  
		  const formattedMessages = messages.map((message) => ({
			...message,
			formattedTimestamp: moment(message.timestamp).format('MMMM Do YYYY, h:mm:ss a'),
		  }));
  
		  socket.emit('printPreviousMessages', formattedMessages);
		} catch (error) {
		  socket.emit('notification', { message: error.message, type: 'error' });
		}
	  });
  
	  socket.on('newMessage', async ({ user, message }) => {
		try {
		  const newMessage = await messageManagerMongo.addMessage(user, message);
		  socket.broadcast.emit('notification', `Hay un nuevo mensaje de ${user}`);
  
		  io.emit('printNewMessage', {
			user: newMessage.user,
			content: newMessage.content,
			timestamp: moment(newMessage.timestamp).format('MMMM Do YYYY, h:mm:ss a'),
		  });
  
		} catch (error) {
		  socket.emit('notification', { message: error.message, type: 'error' });
		}
	  });
  
	  socket.on('addProductToCart', async ({ cid, pid }) => {
		try {
		  await cartManagerMongo.addProductToCart(cid, pid)
		  socket.emit('notification', { message: 'El producto se agregó al carrito exitosamente', type: 'success' });
		} catch (error) {
		  socket.emit('notification', { message: error.message, type: 'error' });
		}
	  });
  
	})
  }

module.exports = handleSocketConnection