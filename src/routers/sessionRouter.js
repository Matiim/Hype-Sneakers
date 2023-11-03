const passport = require('passport')
const userManagerMongo = require('../DAOs/mongo/UserManagerMongo')
const userManager = new userManagerMongo()
const {Router} = require('express')
const sessionRouter = new Router()
const UserDto = require('../DAOs/DTOs/usersDto')
const passportCall = require('../utils/passportCall')
const {authorizationMiddleware } = require('../middlewares/sessionMiddleware')
const {transportGmail}=require('../config/nodemailer')
const settings = require('../commands/commands')
const {generateToken,verifyToken} = require('../utils/jwt')

//endpoint de registro
sessionRouter.post('/register',passportCall('register'), async (req, res) => {
	try {
		return res.status(201).json('El usuario fue registrado!');
	} catch (error) {
		next(error)
	}
});


//endpoint de login 
sessionRouter.post('/login', passportCall('login'),async (req, res) => {
    const token = req.user.token;
    const user = req.user;
    try {
        return res.cookie('authTokenCookie', token, {
            maxAge: 60 * 60 * 1000
        }).status(201).json({payload:user})
    } catch (error) {
        next(error)
    }
});


//github
sessionRouter.get('/github', passport.authenticate('github', {
	scope: ['user:email']
}));


//github callback
sessionRouter.get('/github-callback', passport.authenticate('github', { session: false }), (req, res) => {
	const token = req.user.token;
	return res.cookie('authTokenCookie', token, {
		maxAge: 60 * 60 * 1000
	}).redirect('/home')
});

//current
sessionRouter.get('/current',passportCall('jwt'),authorizationMiddleware('ADMIN'), (req, res) => {
	try {
		const currentUser = req.user
		const first_name = currentUser.first_name
		const last_name = currentUser.last_name || ''
		const age = currentUser.age
		const userDto = new UserDto(first_name, last_name, age)
		res.status(200).json(userDto)
	} catch (error) {
		res.status(500).json(error)
	}
})


//endpoint de recuperar password
sessionRouter.post('/passwordrecovery', async (req, res) => {
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

sessionRouter.post('/password/reset/:token', async (req, res) => {
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

sessionRouter.put('/premium/:uid', async (req, res) => {
		const { uid } = req.params
		const { newRole } = req.body
		try {
			const user = await userManager.updateUserRole(uid, newRole)
			return res.status(200).json({payload:user})
		} catch (error) {
		return res.status(500).json({ status: 'error', message: 'Error al actualizar el rol de usuario' });
		
		}

})
//eliminar cuenta 
sessionRouter.delete('/:userId', async (req, res) => {
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

module.exports = sessionRouter
