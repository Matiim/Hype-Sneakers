const {Router} = require('express')
const sessionRouter = new Router()
const userManagerMongo =require('../dao/UserManagerMongo')
const userManager = new userManagerMongo()


const adminUser = {
	name: 'Admin',
	lastname: 'Coder',
	email: 'adminCoder@coder.com',
	password: 'adminCod3r123',
	age: 21,
	admin: true,
	role:'admin'
}

//endpoint de registro
sessionRouter.post('/register',async (req, res) =>{
	const newUser = req.body
	try{
		await userManager.createUser(newUser)
		return res.redirect('/login')
	}catch(error){
		throw error
	}

  })


//endpoint de login 
  sessionRouter.post('/login',async (req, res) =>{
	const {email,password} = req.body

	try{

		if (email === adminUser.email && password === adminUser.password){
			req.session.user = adminUser
			return res.redirect('/realtimeproducts')
		}
		const user = await userManager.userAuthenticate(email,password)
		req.session.user = user
		return res.redirect('/products')
	}catch (error){
		res.redirect('/login')
	}

  })
module.exports = sessionRouter
