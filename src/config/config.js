const config = () => {
	return {
	  
	  client_Id: process.env.CLIENT_ID,
      client_Secret: process.env.CLIENT_SECRET,
	  private_cookie: process.env.PRIVATE_COOKIE,
	  private_session: process.env.PRIVATE_SESSION,
	  
	  emailUser: process.env.EMAIL_USER,
      passUser: process.env.PASS_USER,
	  environment : process.env.ENVIRONMENT,
	  stripeKey: process.env.STRIPE_KEY,
	  adminId: process.env.ADMIN_ID
	}
  }
  
module.exports = config