const productsDaoMongo = require('../DAOs/mongo/ProductManagerMongo')

const storageMapper ={
	mongo: ()=> new productsDaoMongo(),
	default: () => new productsDaoMongo()
}

const getProductsDao = (storage) => {
	const storageFn = storageMapper[storage] || storageMapper.default

	const dao = storageFn()

	return dao
}

module.exports = {getProductsDao}