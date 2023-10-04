const UsersManager = require('../dao/UserManagerMongo')

class UsersService{
	constructor(){
		this.usersManager = new UsersManager
	}
}

module.exports = UsersService