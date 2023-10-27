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

        if (response.ok) {
            if (data.payload.productosSinSuficienteStock.length > 0) {
                Swal.fire({
                    title: 'Partial Purchase',
                    html: `Some products could not be added due to insufficient stock. Other products have been added successfully. 
                    <p class="bold">Products out of stock:</span> ${data.payload.productosSinSuficienteStock.join('<br>')}
                    <p class="bold">Total Amount: ${data.payload.amount}</p>
                    <p class="bold">Thank you, ${data.payload.purchaser}</p>`,
                    icon: 'warning',
                    willClose: () => {
                        window.location.href = '/products';
                    }
                });
            } else {
                Swal.fire({
                    title: `Thank you, ${data.payload.purchaser}</p>`,
                    html: `<p>All products have been added successfully. </p>
                    <p class="bold">Total Amount: ${data.payload.amount}</p>`,
                    icon: 'success',
                    willClose: () => {
                        window.location.href = '/products';
                    }
                });
            }
        } else {
            Swal.fire({
                title: 'Error to purchase the products',
                html: `</p>${data.error}</p>`,
                icon: 'error',
            });
        }
    });
}