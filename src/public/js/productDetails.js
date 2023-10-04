const addToCartButtons = document.querySelectorAll('.addToCartButton');

addToCartButtons.forEach((button) => {
    button.addEventListener('click', async (e) => {
        const productId = e.target.id
        try {
            const response = await fetch('/api/sessions/addToCart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId }),
            });

         return response
        } catch (error) {
            console.error('Error:', error);
        }
    });
});