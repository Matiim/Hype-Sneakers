const usersService = require('../service/usersService')

class usersController {
	constructor(){
		this.service = new usersService()
	}
}

module.exports = usersController