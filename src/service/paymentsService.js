const Stripe = require('stripe');
const CartsService = require('../service/cartsService')
const cartsService = new CartsService()
const ProductsService = require('../service/productsService')
const productsService = new ProductsService()
let stockBackup


class PaymentsService {
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_KEY);
    }

	createPaymentIntent = async (user) => {
        try {
            const { amountTotal, filteredProductsWithStock, productosSinSuficienteStock, stockBackup } = await cartsService.processCartProducts(user.cart);

            if (!filteredProductsWithStock) {
                throw new Error('Productos no encotrados');
            }

            const amountInCents = Math.round(amountTotal * 100);

            const paymentIntentInfo = {
                amount: amountInCents,
                currency: 'usd',
                metadata: {
                    userId: user.userId,
                    description: `Pago del carrito ${user.cart}`,
                    productosSinSuficienteStock: productosSinSuficienteStock.join(','),
                    address: JSON.stringify({
						contry:'Argentina',
						city:'Buenos aires',
                        street: 'Calle de prueba',
                        postalCode: '272056',
                    }, null, '\t'),
                    stockBackup: JSON.stringify(stockBackup),
                }
            };

            const paymentIntent = await this.stripe.paymentIntents.create(paymentIntentInfo);

            return paymentIntent
        } catch (error) {
            throw error
        }
    }

	async confirmPaymentIntent(paymentIntentId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
                payment_method: 'pm_card_visa',
                return_url: `http://localhost:8080/home`,
            });

            stockBackup = JSON.parse(paymentIntent.metadata.stockBackup);

            return paymentIntent;
        } catch (error) {
            
            throw error;
        }
    }

	async cancelPayment(paymentIntentId) {
        try {
            const paymentIntentCancel = await this.stripe.paymentIntents.cancel(paymentIntentId)
            
            stockBackup = JSON.parse(paymentIntentCancel.metadata.stockBackup)
            await this.restoreStock(stockBackup)
            return paymentIntentCancel
		}catch(error){
			throw(error)
		}
	}

	async restoreStock(productsData) {
        try {
            for (const { pid, originalStock } of productsData) {
                const stockToUpdate = { stock: originalStock }
                await productsService.updateProduct(pid, stockToUpdate);
            }
		}catch(error){
			throw error
		}
	}
}

module.exports = PaymentsService