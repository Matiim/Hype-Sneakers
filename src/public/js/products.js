const addToCartButtons = document.querySelectorAll('.addToCartButton');

addToCartButtons.forEach((button) => {
    button.addEventListener('click', async (e) => {
        const userId = e.target.getAttribute('data-user-id');
        const productId = e.target.getAttribute('data-product-id');
        try {
            const response = await fetch('/api/sessions/addToCart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, productId }),
            });
			return response
        } catch (error) {
            console.error('Error:', error);
        }
    });
});