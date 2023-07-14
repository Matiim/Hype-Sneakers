const socket = io()

const productList = document.getElementById('product-list');
const addProductForm = document.getElementById('add-product-form')
const deleteProductForm = document.getElementById('delete-product-form')



socket.on('newProduct', (product) => {
  const parsedProduct = JSON.parse(product);
  const newProductItem = document.createElement('li');
  newProductItem.textContent = `${parsedProduct.id} - ${parsedProduct.title} - ${parsedProduct.price}`;
  productList.appendChild(newProductItem);
});

socket.on('productDeleted', (productId) => {
  const productItem = document.getElementById(productId);

  if (productItem) {
    productItem.remove()
  }
});




addProductForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(addProductForm);
  const product = Object.fromEntries(formData.entries());
  const newProduct = {
    ...product,
   
  }
  socket.emit('addProduct', JSON.stringify(newProduct))
  addProductForm.reset();
})

deleteProductForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(deleteProductForm);
  const productId = Object.fromEntries(formData.entries()).id;
  socket.emit('deleteProduct', productId)
  deleteProductForm.reset();
})