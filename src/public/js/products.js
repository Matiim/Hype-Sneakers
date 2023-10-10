const addToCartButtons = document.querySelectorAll('.addToCartButton');

addToCartButtons.forEach((button) => {
    button.addEventListener('click', async (e) => {
        const cartId = e.target.getAttribute('data-cart-id');
        const productId = e.target.getAttribute('data-product-id');
        try {
            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Success',
                    text: 'Product added to the cart successfully',
                    icon: 'success'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Error adding the product to the cart',
                    icon: 'error',
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});