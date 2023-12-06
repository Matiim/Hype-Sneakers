const {transportGmail} = require('../config/nodemailer')
const UsersService = require('../service/usersService')
const {generateToken , verifyToken} = require('../utils/jwt')

class UsersController{
	constructor(){
		this.service = new UsersService()
	}

	async getUsers(req,res){
		try{
			const users = await this.service.getUsers()
			return res.status(200).json({payload: users})
		}catch(error){
			return res.status(500).json({status:'error', message:'Error buscando el usuario'})
		}
	}

	async updateUserDocuments(req,res){
		const { uid } = req.params
		const { files } = req
		try{
			if(files.length === 0 || !files || !Array.isArray(files)){
				return res.status(409).json({status:'error',message:'No hay archivos'})
			}
			await this.service.updateUserDocuments(uid,files)
			return res.status(200).json({message:'Archivo actualizado correctamente'})
		}catch(error){
			return res.status(500).json({status:'error', message:'Error buscando el usuario'})
		}
	}

	async updateUserRole(req,res){
		const { uid } = req.params
        const { newRole } = req.body
		try{
			if(!newRole){
				return res.status(409).json('Envie un rol de usuario valido')
			}
			await this.service.updateUserRole(uid,newRole)
			return res.status(200).json('Rol del usuario actualizado')
		}catch(error){
			if(error.message.includes('Te faltan los siguientes documentos')){
				return res.status(409).json({status:'error', message:error.message}) 
			}
			return res.status(500).json({status:'error', message:'Error buscando el usuario'})
		}
	}

	async sendEmailRecovery(req,res){
		const { email } = req.body
		try{
			const user =  await this.service.getUserByFilter({email})
			if(!user){
				return res.status(404).json({status:'error', message:'El email no corresponde a ningun usuario registrado'})
			}
			const token = generateToken({
				userId: user._id
			})

			const resetLink = `http:localhost:${process.env.PORT}/password/reset/${token}`

			await transportGmail.sendMail({
				from: `Hype Sneakers < ${process.env.EMAIL_USER}>`,
				to: user.email,
				subject: 'Recuperacion de contraseña',
				html: `<div>
							<h1>Recuperacion de contraseña</h1>
							<button><a href="${resetLink}">Restablecer la contraseña</a></button>
					   </div>`,
				attachments: []		   
			})

			return res.status(200).json('Email enviado correctamente')
		}catch(error){
			return res.status(500).json({status:'error', message:'Error al enviar el email'})
		}
	}

	async resetPassword(req,res){
		const { token } = req.params
		const { newPassword } = req.body
		try{
			const decodedToken = await verifyToken(token)

			const userId = decodedToken.userId


			await this.service.resetPassword(userId,newPassword)
			return res.status(200).json('Contraseña restablecida')
		}catch(error){
			if(error.message === 'La nueva contraseña tiene que ser distinta a la anterior'){
				return res.status(409).json({status:'error', message:error.message}) 
			}
			if(error.message === 'Usuario no encotrado'){
				return res.status(404).json({status:'error', message:error.message}) 
			}
			return res.status(500).json({status:'error', message:'Error al restablecer la contraseña'})
		}
	}

	async deleteUser(req,res){
		const { userId } = req.params
		try{
			await this.service.deleteUser(userId)
			res.status(200).json('Cuenta eliminada')
		}catch(error){
			return res.status(500).json({status:'error', message:'Error al eliminar la cuenta'})
		}
	}

	async deleteInactiveUser(req,res){
		try{
			const usersDeled = await this.service.deleteInactiveUser()
			
			res.status(200).json(`${usersDeled} usuarios eliminados`)
		}catch(error){
			if(error.message === 'No hay usuarios para eliminar'){
				return res.status(409).json({status:'error', message:error.message}) 
			}
			return res.status(500).json({status:'error', message:'Error al eliminar usuario inactivo'})
		}
	}


}

module.exports = UsersController