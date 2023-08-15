const socket = io()

const productsForms = document.querySelectorAll('.productOptions form');

productsForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const cid = form.querySelector('#inputCartId').value;
        const pid = form.getAttribute('id');

        socket.emit('addProductToCart', { cid, pid })

        form.reset()
    });
});