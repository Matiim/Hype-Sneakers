const config = () => {
	return {
	  db_host: process.env.DB_HOST,
	  db_user: process.env.DB_USER,
	  db_password: process.env.DB_PASSWORD,
	  db_name: process.env.DB_NAME,
	  client_Id: process.env.CLIENT_ID,
      client_Secret: process.env.CLIENT_SECRET,
	  private_cookie: process.env.PRIVATE_COOKIE,
	  private_session: process.env.PRIVATE_SESSION,
	  jwt_key: process.env.JWT_KEY,
	  emailUser: process.env.EMAIL_USER,
      passUser: process.env.PASS_USER,
	 
	}
  }
  
module.exports = config