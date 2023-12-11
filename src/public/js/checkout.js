const stripe = Stripe('pk_test_51OIGDkIOHPxy6GF6qLtqGfuiuzcDPbXir5E8mklUJLEBrF5EVsrqJgkIwMTKTSPqNLXeywcG0zXN3Hw2jvny84XP00BMBVDuLa');
const savedPaymentIntentId = localStorage.getItem('paymentIntentId');
const paymentSubmitButton = document.getElementById('submit-payment');
const paymentFormElement = document.querySelector('.payment-form');
const stripeElements = stripe.elements();
const cardStripeElement = stripeElements.create('card', {
    hidePostalCode: true
});
cardStripeElement.mount('#card-element');

if (!savedPaymentIntentId) {
    Swal.fire({
        title: 'Error',
        text: 'ID de intención de pago no encontrado',
        icon: 'error',
        willClose: () => {
            window.location.href = '/products';
        }
    });

}

cardStripeElement.on('change', (e) => {
    if (e.error) {
        Swal.fire({
            title: 'Error',
            text: `${e.error.message}`,
            icon: 'error',
        });
    } else {
        paymentSubmitButton.style.display = e.complete ? 'block' : 'none';
    }
});

paymentFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const response = await fetch('/api/payments/confirm-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentIntentId: savedPaymentIntentId }),
			
        });

        const result = await response.json();

        if (response) {
            localStorage.removeItem('paymentIntentId');
            paymentSubmitButton.disabled = true;
            Swal.fire({
                title: 'Pago realizado',
                text: 'El pago fue procesado exitosamente',
                icon: 'success',
                willClose: () => {
                    window.location.href = '/products';
                }
            });
        } else {
            Swal.fire({
                title: 'Error al procesar el pago',
                text: `${result.detail}`,
                icon: 'error',
            });
        }
    } catch (error) {
        Swal.fire({
            title: 'Error al procesar el pago',
            text: `${error}`,
            icon: 'error',
        });
    }
});

const cancelPaymentButton = document.getElementById('cancel-payment')
cancelPaymentButton.addEventListener('click', async (e) => {
    e.preventDefault()
    const response = await fetch('/api/payments/cancel-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId: savedPaymentIntentId }),
    });
    const data = await response.json()

    if (response) {
        localStorage.removeItem('paymentIntentId');
        paymentSubmitButton.disabled = true;
        Swal.fire({
            title: 'Pago cancelado ',
            text: 'The payment was successfully cancel',
            icon: 'success',
            willClose: () => {
                window.location.href = '/products';
            }
        });
    } else {
        Swal.fire({
            title: 'Error al cancelar el pago',
            text: `${data.detail}`,
            icon: 'error',
        });
    }
})