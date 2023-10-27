const productModel = require('./models/productModel')
const productsDto = require('../DTOs/productsDto')
const e = require('connect-flash')

class ProductManagerMongo {
    constructor() {
        this.model = productModel
    }

	async getProducts(filters, query) {
        try {
            const products = await this.model.paginate(filters, query)
			const result = new productsDto(products)	
            return result
        } catch (error) {
            throw error
        }
    }

    async getProductById(pid) {
        try {
            const product = await this.model.findById(pid)
            if (!product) {
                throw new Error('No se encuentra el producto')
            }

            return product.toObject()
        } catch (error) {
            throw error
        }
    }

	async getProductByCode(code) {
        try {
            const product = await this.model.findOne({ code: code });
            return product
        } catch (error) {
            throw error
        }
    }

    async addProduct(data) {
        try {
			let owner
			if(data.userId === '1' || !data.userId){
				owner = 'ADMIN'
			}else{
				owner = data.userId
			}
			
            const newProduct = await this.model.create(
                {
                    title: data.title,
                    description: data.description,
                    code: data.code,
                    price: data.price,
                    status: data.status,
                    stock: data.stock,
                    category: data.category,
                    thumbnails: data.thumbnails || [],
					owner: owner
                }
            )

            return newProduct

        } catch (error) {
            throw error
        }
    }


    async updateProduct(pid, productData,userId) {

        try {
            const product = await this.getProductById(id);
			if((userId !== 1 || !userId) && userId !== product.owner){
				throw new Error('No puedes modificar el producto')
			}

            const productUpdated = {
                ...product,
                ...productData,
            };

            productUpdated._id = product._id;
            await this.model.updateOne({ _id: pid }, productUpdated);

            

            return productUpdated;
        } catch (error) {
            throw error;
        }
    }
	async saveProduct(pid){
		try{
			const product = await this.getProductById(pid)
			if(!product){
				throw new Error('Producto no encontrado')
			}
			product.save()
		}catch(error){
			throw error
		}
	}

    async deleteProduct(pid,userId) {
        try {
            const product = await this.model.findById(id)
            
			if((userId !== 1 || !userId) && userId !== product.owner){
				throw new Error('No puedes eliminar el producto')
			}
            await this.model.deleteOne({ _id: pid })
			
           
        } catch (error) {
            throw error
        }
    }

}

module.exports = ProductManagerMongo






















