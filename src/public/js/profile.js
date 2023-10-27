const deleteButton = document.querySelector('.deleteButton');

deleteButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const userId = e.target.getAttribute('data-userid');
    try {

        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            Swal.fire({
                text: 'Cuenta eliminada exitosamente',
                icon: 'success',
                timer: 3000,
                willClose: () => {
                    window.location.href = '/login';
                }
            });
        }

    } catch (error) {
        Swal.fire({
            text: 'Se produjo un error al eliminar la cuenta',
            icon: 'error',
            timer: 3000,
        });
    }
});