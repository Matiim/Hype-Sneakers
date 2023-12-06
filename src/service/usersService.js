const { transportGmail } = require('../config/nodemailer')
const UsersRepository = require('../repository/usersRepository')
const {createHash,isValidPasswors} = require('../utils/passwordHash')

class UsersService{
	constructor(){
		this.repository = new UsersRepository()
	}

	async getUsers(params){
		return this.repository.getUsers(params)
	}

	async getUserById(uid){
		return this.repository.getUserById(uid)
	}

	async getUserByFilter(filter){
		return this.repository.getUserByFilter(filter)
	}

	async addToMyCart(uid,pid){
		return this.repository.addToMyCart(uid,pid)
	}

	async createUser(data){
		return this.repository.createUser(data)
	}

	async resetPassword(uid,password){
		const user = await this.repository.getUserById(uid)

		if(isValidPasswors(password,user.password)){
			throw new Error('La contraseña tiene que ser distinta a la anterior')
		}
		const newPassword = createHash(password)
		return this.repository.resetPassword(uid,newPassword)
	}

	async updateUserRole(uid, newRole) {
        const ROLE_PREMIUM = 'PREMIUM'
        try {
            const user = await this.repository.getUserById(uid)
			if(!user){
				throw new Error('Usuario no encontrado')
			}

			if(user.role === newRole){
				throw new Error('Ya tiene ese rol')
			}

			if (newRole === ROLE_PREMIUM) {
                const requiredDocuments = [
                    `${uid}_Identificacion`,
                    `${uid}_Comprobante de domicilio`,
                    `${uid}_Comprobante de estado de cuenta`
                ];

                //el siguiente array contendrá los documentos que están en requiredDocuments pero no en user.documents
                const missingDocuments = requiredDocuments.filter(doc => !user.documents.some(userDoc => userDoc.name === doc));

                //si hay documentos faltantes se procede a
                if (missingDocuments.length > 0) {
                    const splitDocuments = requiredDocuments.map(document => {
                        const [id, type] = document.split('_');
                        return { id, type };
                    });

                    //nuevo array con solo los "tipos" de los archivos que estarían faltando
                    const missingTypes = splitDocuments
                        .filter(doc => missingDocuments.includes(`${doc.id}_${doc.type}`))
                        .map(doc => doc.type);

						const missingDocumentsMessage = `Te faltan los siguientes documentos: ${missingTypes.join(', ')}`
					throw new Error(missingDocumentsMessage)
				}
			}
			return this.repository.updateUserRole(uid, newRole)
		}catch(error){
			throw(error)
		}
		
	}

	async updateUserLastConnection(user){
		return this.repository.updateUserLastConnection(user)
	}


	async updateUserDocuments(uid,files){
		const user = await this.repository.getUserById(uid)
		const documentsToUpload = user.documents || []

		files.forEach(file => {
			const fileName = file.filename.split('.')
			documentsToUpload.push({
				name: fileName[0],
				reference: `http://localhost:8080/src/public/img/documents/${file.filename}`
			})
		})
		return this.repository.updateUserDocuments(uid,documentsToUpload)
	}


	async deleteUser(uid){
		return this.repository.deleteUser(uid)
	}


	async deleteInactiveUser(){
		try{
			const inactiveTime = new Date()
	
			inactiveTime.setMinutes(inactiveTime.getDate() -2)
			const userToDelete = await this.repository.getUsers({last_connection:{$lt: inactiveTime}})

			if(userToDelete.length === 0){
				throw new Error('Usuario no eliminado')
			}

		for(const user of userToDelete){
			await transportGmail.sendMail({
				from: `hype sneakers < ${process.env.EMAIL_USER}>`,
				   to: user.email,
				subject:'Cuenta eliminado',
				html: `<div>
						<h1>Lo sentimos</h1>
						<p>${user.firts_name}${user.last_name}, tu cuenta ha sido eliminada por inactividad</p>
					 </div>`,
				attachments: []
			})
		}
	
		return this.repository.deleteInactiveUser(userToDelete)
	

		 }catch(error){
			throw error
		}
	}
}

module.exports = UsersService