const bcrypt = require('bcrypt')

const createHash = (password) =>{//(la ocupamos en el registro)
	return bcrypt.hashSync(password,bcrypt.genSaltSync(10))//esto devuelve el password hasheado
}

const isValidPassword = (password,hashdPassword) =>{//(la ocupamos en el login)
	return bcrypt.compareSync(password,hashdPassword)//esto compara el password en texto plano y el hasheado y si coincide, devuelve true
}

module.exports = {
	createHash,
	isValidPassword
}