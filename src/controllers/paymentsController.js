const CartsService = require('../service/cartsService')
const cartsService = new CartsService()
const PaymentsService = require('../service/paymentsService')


class PaymentsController {
	constructor(){
		this.service = new PaymentsService()
	}


    async createPaymentIntent(req, res) {
        const user = req.user;
        try {
            const paymentIntent = await this.service.createPaymentIntent(user);
			res.status(200).json({payload:paymentIntent})

		}catch(error){
			return res.status(500).json('Error interno del servidor')
		}
	}


	async confirmPaymentIntent(req, res) {
        const { paymentIntentId } = req.body;
        const user = req.user;

        try {
            const paymentIntent = await this.service.confirmPaymentIntent(paymentIntentId);

            const productosSinSuficienteStock = paymentIntent.metadata.productosSinSuficienteStock || [];

            await cartsService.finishPurchase({
                amount: paymentIntent.amount,
                user,
                productosSinSuficienteStock,
            });

			return res.status(200).json({payload:paymentIntent})
		}catch (error){
			res.status(500).json('Error interno del servidor')
		}
	}

	async cancelPayment(req, res) {
        const { paymentIntentId } = req.body;
        try {
            await this.service.cancelPayment(paymentIntentId);
			res.status(200).json('Pago cancelado correctamente')
		}catch(error){
			res.status(500).json('Error interno del servidor')
		}
	}
}

module.exports = PaymentsController