const updateUserRole = async (uid) => {
    const row = document.getElementById(uid);
    const newRole = row.cells[2].querySelector("input").value;
    const response = await fetch(`/api/users/premium/${uid}`, {
        method: 'PUT',
        body: JSON.stringify({
            newRole
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (response.ok) {
        Swal.fire({
            title: 'Success',
            text: 'Rol de usuario actualizado',
            icon: 'success',
            timer: 3000,
        });
    } else {
        if (data.error.includes('Te faltan los siguentes documentos')) {
            const documentsError = data.error.replace('Te faltan los siguentes documentos: ', '');
            Swal.fire({
                title: 'Error',
                html: `Te faltan los siguentes documentos: <strong>${documentsError}</strong>`,
                icon: 'error',
                timer: 3000,
            });
        } else {
            Swal.fire({
                title: 'Error',
                html: `${data.error}`,
                icon: 'error',
                timer: 3000,
            });
        }
    }
};

const deleteUser = async (userId) => {
    const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const data = await response.json()
    console.log(response.ok)
    if (response.ok) {
        Swal.fire({
            icon: 'success',
            text: 'Usuario eliminado',
            timer: 3000,
        });
    } else {
        Swal.fire({
            text: 'Se produjo un error al eliminar el usuario' || data.error,
            icon: 'error',
            timer: 3000,
        });
    }
}

const deleteInactiveUsers = async () => {
    const response = await fetch('/api/users/', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json()

    if (response.ok) {
        Swal.fire({
            icon: 'success',
            text: 'Usuarios eliminados',
            timer: 3000,
        });
    }

    Swal.fire({
        text: data.error || 'Se produjo un error al eliminar los usuarios',
        icon: 'error',
        timer: 3000,
    });
}

const uploadDocuments = async (uid) => {
    const fileInput = document.getElementById(`documents-${uid}`);
    const files = fileInput.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        formData.append('documents', files[i]);
    }

    try {
        const response = await fetch(`api/users/${uid}/documents`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                text: 'Documentos subidos correctamente',
                timer: 3000,
            });
        } else {
            Swal.fire({
                text: data.error || 'Error al subir los documentos',
                icon: 'error',
                timer: 3000,
            });
        }
    } catch (error) {
        Swal.fire({
            text: 'ocurrió un error inesperado',
            icon: 'error',
            timer: 3000,
        });
    }
};