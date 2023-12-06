const deleteCartButton = document.getElementById('deleteCartButton')
const productsContainer = document.querySelector('.productsContainer')
const checkoutButton = document.getElementById('checkoutButton')

if (deleteCartButton) {
    deleteCartButton.addEventListener('click', async (e) => {
        e.preventDefault()
        const cid = e.target.getAttribute('data-cart-id');
        const response = await fetch(`/api/carts/${cid}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            Swal.fire({
                text: 'Carrito eliminado',
                icon: 'success',
				didClose: () => {
					window.location.href = '/products';
				}
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al eliminar carrito',
                icon: 'error',
            });
        }
    })

	checkoutButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const cid = e.target.getAttribute('data-cart-id');
        const response = await fetch('/api/payments/payment-intents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json()

        if (response.ok) {
            localStorage.setItem('paymentIntentId', result.payload.id);
            window.location.href = `/carts/${cid}/checkout`
        } else {
            Swal.fire({
                title: 'Error',
                text: `Error al ir a pagar`,
                icon: 'error',
            });
        }
    });
}