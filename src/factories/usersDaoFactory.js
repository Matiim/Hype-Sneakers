const usersDaoMongo = require('../DAOs/mongo/UserManagerMongo')


const stotageMapper = {
	mongo: () => new usersDaoMongo(),
	default: () => new usersDaoMongo()
}

const getUsersDao = (storage) => {
	const storageFn = stotageMapper[storage] || stotageMapper.default

	const dao = storageFn()

	return dao
}

module.exports = {getUsersDao}