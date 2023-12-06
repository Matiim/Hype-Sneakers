const sendEmailButton = document.getElementById('sendEmailButton')
const resetPasswordButton = document.getElementById('resetPasswordButton')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')

if (sendEmailButton) {
    sendEmailButton.addEventListener('click', async (e) => {
        e.preventDefault()
        const email = emailInput.value
        const response = await fetch('/api/users/passwordrecovery', {
            method: 'POST',
            body: JSON.stringify({
                email
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json();

        if (response) {
            Swal.fire({
                text: 'Correo electrónico enviado correctamente.',
                icon: 'success',
				willClose: () => {
                    window.location.href = '/passwordRecovery';
                }
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al enviar el correo electrónico',
                icon: 'error',
            });
        }
    })
}

if (resetPasswordButton) {
    resetPasswordButton.addEventListener('click', async (e) => {
        e.preventDefault()
        const newPassword = passwordInput.value
        const token = window.location.pathname.split('/').pop();

        const response = await fetch(`/api/users/password/reset/${token}`, {
            method: 'POST',
            body: JSON.stringify({
                newPassword
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                text: 'Contraseña recuperada',
                icon: 'success',
                willClose: () => {
                    window.location.href = '/login';
                }
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al recuperar la Contraseña',
                icon: 'error',
            });
        }
    })
}