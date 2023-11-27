const userManagerMongo = require('../DAOs/mongo/UserManagerMongo')
const userManager = new userManagerMongo()
const {Router} = require('express')
const usersRouter = new Router()
const {transportGmail}=require('../config/nodemailer')
const settings = require('../commands/commands')
const {generateToken,verifyToken} = require('../utils/jwt')
const uploader = require('../middlewares/uploader')


usersRouter.post('/:uid/documents',uploader.array('documents'), async (req, res) => {
	const { uid } = req.params
	const { files } = req
	try{
		const user = await userManager.getUserById(uid)
		if(!files || !Array.isArray(files)){
			return res.status(409).json({status: 'error', message: 'Sin archivos' })
		}
		const documents = user.documents || []

		files.forEach(file =>{
			const fileName = file.filename.split('.')
			documents.push({
				name: fileName[0],
				reference: `http://localhost:8080/img/documents/${file.filename}`
			})
		})

		await userManager.updateUserDocuments(uid,documents)
		return res.status(200).json( 'Documentos cargados exitosamente' )

	}catch(error){
		if (error.message === 'El usuario no existe') {
			return res.status(404).json({status: 'error',message: error.message})
		}
		return res.status(500).json({ status: 'error', message: 'Error al cargar los documentos ' });
	}
})


//endpoint de recuperar password
usersRouter.post('/passwordrecovery', async (req, res) => {
	const { email } = req.body
	try {
		const user = await userManager.getUserByEmail(email)
		if (!user) {
			return res.status(404).json('El correo electrónico  no corresponde a ningún usuario registrado')
		}
		const token = generateToken({
			userId: user._id
		})

		const resetLink = `http://localhost:8080/password/reset/${token}`;

		await transportGmail.sendMail({
			from: `Shop Easy < ${settings.emailUser}>`,
			to: user.email,
			subject: 'Password Recovery',
			html: `<div>
						<h1>Password Recovery</h1>
						<button><a href="${resetLink}">Reset Password</a></button>
					</div>`,
			attachments: []
		});

		return res.status(200).json ({message:'Email enviado correctamente'})
	} catch (error) {
		return res.status(500).json({status: 'error',message:'Error al enviar el email'})
	}
})

usersRouter.post('/password/reset/:token', async (req, res) => {
		const { token } = req.params;
		const { newPassword } = req.body

		try {
			const decodedToken = await verifyToken(token)

			const userId = decodedToken.userId

			await userManager.resetPassword(userId, newPassword)

			return res.status(200).json( {message:'Restablecimiento de contraseña exitoso'});
		} catch (error) {
			if (error.message === 'La nueva contraseña no puede ser la misma que la anterior') {
				return res.status(409).json({status: 'error',message: error.message})
			}
			if (error.message === 'El usuario con ese correo electrónico no existe') {
				return res.status(404).json({status: 'error',message: error.message})
			}
			return res.status(500).json({ status: 'error', message: 'Error al restablecer la contraseña ' });

		}
});

usersRouter.put('/premium/:uid', async (req, res) => {
		const { uid } = req.params
		const { newRole } = req.body
		try {
			const userUpdate = await userManager.updateUserRole(uid, newRole)
			return res.status(200).json({payload:userUpdate})
		} catch (error) {
		if (error.message.include === 'Te faltan los siguientes documentos') {
			return res.status(404).json({status: 'error',message: error.message})
		}
		return res.status(500).json({ status: 'error', message: 'Error al actualizar el rol de usuario' });
		
		}

})
//eliminar cuenta 
usersRouter.delete('/:userId', async (req, res) => {
	const { userId } = req.params
	const contentType = req.headers['content-type']
	try {
		await userManager.deleteUser(userId)
		res.clearCookie('authTokenCookie');
		return res.status(201).json({ status: 'success', message: 'Usuario eliminado' });
	} catch (error) {
		if (contentType === 'application/json') {
		return res.status(500).json({ status: 'error', message: 'Error al eliminar usuario' });
		}
		return res.redirect(`/error?errorMessage=${error.message}`)
	}
});

module.exports = usersRouter