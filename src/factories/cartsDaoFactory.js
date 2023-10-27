const cartsDaoMongo = require('../DAOs/mongo/CartsManagerMongo')

const storageMapper ={
	mongo: ()=> new cartsDaoMongo(),
	default: () => new cartsDaoMongo()
}

const getCartsDao = (storage) => {
	const storageFn = storageMapper[storage] || storageMapper.default

	const dao = storageFn()

	return dao
}

module.exports = {getCartsDao}