const productsContainer = document.querySelector('.productsContainer')
const deleteCartButton = document.getElementById('deleteCartButton')
const buyButton = document.getElementById('buy')

if (deleteCartButton && buyButton) {
    deleteCartButton.addEventListener('click', async (e) => {
        e.preventDefault()
        const cid = e.target.getAttribute('data-cart-id');
        const response = await fetch(`/api/carts/${cid}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            Swal.fire({
                text: 'Carrito eliminado',
                icon: 'success'
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al eliminar el carrito',
                icon: 'error',
            });
        }

        productsContainer.innerHTML = '<h1>Carrito vacio</h1>'
    })

    buyButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const cid = e.target.getAttribute('data-cart-id');
        const response = await fetch(`/api/carts/${cid}/purchase`, {
            method: 'POST',
        });

        const data = await response.json();
		console.log(data)
        if (response.ok) {
            if (data.payload.productosSinSuficienteStock.length > 0) {
                Swal.fire({
                    title: 'Compra parcial',
                    html: `Algunos productos no se pudieron agregar. 
                    <p class="bold">Productos agotados:</span> ${data.payload.productosSinSuficienteStock.join('<br>')}
                    <p class="bold">Cantidad total: ${data.payload.amount}</p>
                    <p class="bold">Gracias, ${data.payload.purchaser}</p>`,
                    icon: 'warning',
                    willClose: () => {
                        window.location.href = '/products';
                    }
                });
            } else {
                Swal.fire({
                    title: `Gracias, ${data.payload.purchaser}</p>`,
                    html: `<p>Todos los productos se han agregado. </p>
                    <p class="bold">Cantidad total: ${data.payload.amount}</p>`,
                    icon: 'success',
                    willClose: () => {
                        window.location.href = '/products';
                    }
                });
            }
        } else {
            Swal.fire({
                title: 'Error al comprar',
                html: `</p>${data.error}</p>`,
                icon: 'error',
            });
        }
    });
}