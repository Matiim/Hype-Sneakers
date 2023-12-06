const {Router} = require('express')
const paymentsRouter = new Router()
const PaymentsController = require('../controllers/paymentsController')
const paymentsController = new PaymentsController()
const passportCall = require('../utils/passportCall')



paymentsRouter.post('/cancel-payment', 
	paymentsController.cancelPayment.bind(paymentsController)
)

paymentsRouter.post('/payment-intents', 
	passportCall('jwt'), 
	paymentsController.createPaymentIntent.bind(paymentsController)
)
paymentsRouter.post('/confirm-payment-intent',
 	passportCall('jwt'), 
	 paymentsController.confirmPaymentIntent.bind(paymentsController)
 )

module.exports = paymentsRouter