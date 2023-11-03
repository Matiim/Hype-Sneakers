const addToCartButton = document.querySelector('.addToCartButton');

addToCartButton.addEventListener('click', async (e) => {
    const cartId = e.target.getAttribute('data-cart-id');
    const productId = e.target.getAttribute('data-product-id');
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'POST'
    });

    if (response.ok) {
        Swal.fire({
            text: 'Producto agregado al carrito',
            icon: 'success'
        });
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Error al agregar el producto al carrito',
            icon: 'error',
        });
    }
});