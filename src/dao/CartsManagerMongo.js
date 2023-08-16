const cartModel = require("./models/cartModel");
const productModel = require("./models/productModel");

class CartManagerMongo {
    constructor() {
        this.model = cartModel
    }

    async getCarts() {
        try {
            const carts = await this.model.find()
			if(carts.length === 0) {
                throw new Error('No se encuentran carritos en nuestra base de datos')
            }

            return carts.map(c => c.toObject())
        } catch (error) {
            throw error
        }
    }

    async getCartById(id) {
        try {
            const cart = await this.model.find({ _id: id })
            if (!cart) {
                throw new Error('No se encuentra el carrito')
            }
            return cart
        } catch (error) {
            throw error
        }
    }

    async addCart() {
        try {
            const newCart = await this.model.create({})
            return newCart
        } catch (error) {
            throw error
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const cart = await this.model.findById(cid)
            const product = await productModel.findById(pid)

            if (!cart) {
                throw new Error('No se encuentra el carrito')
            }

            if (!product) {
                throw new Error('Producto no encontrado en el inventario')
            }

            const existingProductInCart = cart.products.findIndex((p) => p.product._id.toString() === pid);

            const productToAdd = {
                product: product.id,
            };

            (existingProductInCart !== -1)
                ? cart.products[existingProductInCart].quantity++
                : cart.products.push(productToAdd);

            await this.model.updateOne(
                { _id: cart._id },
                { $set: { products: cart.products } }
            );
        } catch (error) {
            throw error
        }
    }

    async updateCartProducts(cid, newProducts) {
		try{
			const cart = await this.model.findById(cid)
			const products = await productModel.find()

			if(!cart){
				throw new Error('No se encuentra el carrito')
			}

			if(!newProducts){
				throw new Error('No se puede actualizar')
			}

			newProducts.forEach(p => {
				const pId = p.product
				const quantity = p.quantity

				if(!pId || !quantity){
				throw new Error('Cada producto debe tener su ID y su cantidad')
				}

				const inventoryProductId = products.find(p => p._id.toString() === pId)

				if(!inventoryProductId){
				throw new Error('Mirar los Ids cargados en el carrito')
				}
			});

			await this.model.updateOne(
				{_id: cart._id},
				{$set: {products: newProducts}}
			);

		}catch(error){
			throw error
		}
    }

    async updateCartProduct(cid, pid, quantity) {
        try {
            const cart = await this.model.findById(cid)
            const product = await productModel.findById(pid)

            if (!cart) {
                throw new Error('No se encuentra el carrito')
            }

            if (!product) {
                throw new Error('Producto no encontrado en el inventario')
            }

            const existingProductInCart = cart.products.findIndex((p) => p.product._id.toString() === pid);
            if (existingProductInCart === -1) {
                throw new Error('El producto que intentas actualizar no existe en el carrito');
            } else {
                await this.model.updateOne({ _id: cart._id }, { $set: { [`products.${existingProductInCart}.quantity`]: quantity } });
            }

        } catch (error) {
            throw error
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            const product = await productModel.findById(pid)
            const cart = await this.model.findById(cid)

            if (!cart) {
                throw new Error('No se encuentra el carrito')
            }

            if (!product) {
                throw new Error('Producto no encontrado en el inventario')
            }

            const existingProductInCart = cart.products.findIndex((p) => p.product._id.toString() === pid);
            if (existingProductInCart === -1) {
                throw new Error('El producto que intentas eliminar no existe en el carrito')
            }

            await this.model.updateOne(
                { _id: cart.id },
                { $pull: { products: { product: product.id } } }
            )

        } catch (error) {
            throw error
        }
    }

    async deleteProductsFromCart(cid) {
        const cart = await this.model.findById(cid);

        if (!cart) {
            throw new Error('No se encuentra el carrito');
        }

        if (cart.products.length === 0) {
            throw new Error('No hay productos a eliminar');
        }

        await this.model.updateOne(
            { _id: cart.id },
            { $set: { products: [] } }
        );
    }
}

module.exports = CartManagerMongo;
