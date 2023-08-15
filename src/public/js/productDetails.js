const io = socket()

const productDetailForm = document.querySelector('.productDetailFooter form');

productDetailForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cid = productDetailForm.querySelector('#inputCartId').value;
    const pid = productDetailForm.getAttribute('id');

    socket.emit('addProductToCart', { cid, pid });

    productDetailForm.reset();
});