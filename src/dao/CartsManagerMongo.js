const cartModel = require("./models/cartModel");


class CartManagerMongo {
    constructor() {
        this.model = cartModel
    }

    async getCarts() {
        try {
            const carts = await this.model.find()
            return carts.map(c => c.toObject())
        } catch (error) {
            throw error
        }
    }

    async getCartById(id) {
        try {
            const cart = await this.model.find({ _id: id })
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
            const existingProductInCart = cart.products.findIndex((p) => p.product._id.toString() === pid);

            

            (existingProductInCart !== -1)
                ? cart.products[existingProductInCart].quantity++
                : cart.products.push({product:pid, quantity: 1});

            await cart.save()
        } catch (error) {
            throw error
        }
    }

    async updateCartProducts(cid, newProducts) {
		try{
			const cart = await this.model.findById(cid)
			
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
            
            await this.model.updateOne({ _id: cart._id,'products.product':pid }, { $set: { 'products.quantity': quantity } });
            

        } catch (error) {
            throw error
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
          
            const cart = await this.model.findById(cid)


            await this.model.updateOne(
                { _id: cart.id },
                { $pull: { products: { product: pid } } }
            )

        } catch (error) {
            throw error
        }
    }

    async deleteProductsFromCart(cid) {
        const cart = await this.model.findById(cid);

        await this.model.updateOne(
            { _id: cart.id },
            { $set: { products: [] } }
        );
    }
}

module.exports = CartManagerMongo;
