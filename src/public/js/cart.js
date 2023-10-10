const deleteCartButton = document.getElementById('deleteCartButton')
const productsContainer = document.querySelector('.productsContainer')
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
                title: 'Success',
                text: 'Carrito eliminado exitosamente',
                icon: 'success'
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al eliminar carrito',
                icon: 'error',
            });
        }

        productsContainer.innerHTML = '<h1>Cart Empty</h1>'
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
                    title: 'Compra Parcial',
                    html: `Algunos productos no se pudieron agregar debido a stock insuficiente.. 
                    <p class="bold">Productos agotados:</span>${data.payload.productosSinSuficienteStock.join('<br>')}
                    <p class="bold">Cantidad total: ${data.payload.amount}</p>
                    <p class="bold">Gracias, ${data.payload.purchaser}</p>`,
                    icon: 'warning',
                    willClose: () => {
                        window.location.href = '/products';
                    }
                });
            } else {
                Swal.fire({
                    title: 'Gracias por su compra!',
                    html: `<p>Todos los productos se han agregado exitosamente.. </p>
                    <p class="bold">Cantidad total: ${data.payload.amount}</p>
                    <p class="bold">Gracias, ${data.payload.purchaser}</p>`,
                    icon: 'success',
                    willClose: () => {
                        window.location.href = '/products';
                    }
                });
            }
        }else {
            Swal.fire({
                title: 'Error',
                text: 'Error',
                icon: 'error',
            });
        }
    });
		}