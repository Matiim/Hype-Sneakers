const productModel = require('./models/productModel')
const ProductsDto = require('../dao/dto/productsDto')

class ProductManagerMongo {
    constructor(io) {
        this.model = productModel
        this.io = io
    }

	async getProducts(filters, query) {
        try {
            const products = await this.model.paginate(filters, query)

           const result = new ProductsDto(products)

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
			if(
				!data.title ||
				!data.description ||
				!data.code ||
				!data.price ||
				data.status === undefined||
				data.status === null||
				data.status === ''||
				!data.stock ||
				!data.category
			){
				return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios' })
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
                    thumbnails: data.thumbnails
                }
            )

            if (this.io) {
                this.io.emit('newProduct', JSON.stringify(newProduct))
            }

        } catch (error) {
            throw error
        }
    }


    async updateProduct(id, data) {

        try {
            const product = await this.getProductById(id);

            if (!product) {
                throw new Error("Producto no encontrado");
            }

            const productUpdated = {
                ...product,
                ...data,
            };

            productUpdated._id = product._id;
            await this.model.updateOne({ _id: id }, productUpdated);

            if (this.io) {
                this.io.emit('updateProductInView', productUpdated);
            }

            return productUpdated;
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const product = await this.model.findById(id)
            if (!product) {
                throw new Error('Producto no encontrado')
            }
            await this.model.deleteOne({ _id: id })
            if (this.io) {
                this.io.emit('productDeleted', id)
            }
        } catch (error) {
            throw error
        }
    }

}

module.exports = ProductManagerMongo






















