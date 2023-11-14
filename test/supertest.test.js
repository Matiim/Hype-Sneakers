const chai = require('chai');
const supertest = require('supertest')
const uuid = require('uuid')

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Testing de ecommerce Hype Sneakers', function (){
	describe('Test de products',function (){

		let productMock;


		beforeEach(function(){
			productMock = {
				title:'Producto prueba',
				description:'Descripcion del producto',
				code:'asd13eq',
				price:79.000,
				status: true,
				stock: 25,
				category:'ZAPATILLAS',
				thumbnails:[]

			}
		})

		afterEach(function (){
			productMock = null
		})

		it('El endpoint POST /api/products no debe crear un producto si se omite un campo', async function(){
			delete productMock.title
			const {
				statusCode,
				_body
			} = await requester.post('/api/products').send(productMock)

			expect(statusCode).to.be.equal(500)
			expect(_body.status).to.be.equal('error')
		})


		it('el endpoint POST /api/products debe crear un producto correctamente', async function(){
			productMock.code = uuid.v4()
			const {
				statusCode,
				_body
			} = await requester.post('/api/products').send(productMock)

			console.log({statusCode,_body})
			expect(statusCode).to.be.equal(201)
			expect(_body.status).to.be.equal('success')
		})


		
		it('el endpoint POST /api/products  no debe crear un producto por que se repite el campo CODE', async function(){
			const {
				statusCode,
				_body
			} = await requester.post('/api/products').send(productMock)

			
			expect(statusCode).to.be.equal(500)
			expect(_body.status).to.be.equal('error')
		})
	})

	describe('Test de Carts', function (){
		let cid
		
		it('El endpoint GET /api/carts/:cid obtiene un carrito determinado via su ID', async function (){
			cid = '65539e24c46702d6f38c1fb7'
			const {
				statusCode,
				_body
			} = await requester.get(`/api/carts/${cid}`)

			expect(statusCode).to.be.equal(200)
			expect(_body.status).to.be.equal('success')
			expect(_body.payload[0].products).to.be.an('array')
		})

		it('El endpoint GET /api/carts/:cid no obtiene el carrito ya que no existe en la base de datos',async function(){
			cid = '6555439e24c46702d6f38c1fb9'
			const {
				statusCode,
				_body
			} = await requester.get(`/api/carts/${cid}`)

			expect(statusCode).to.be.equal(500)
			expect(_body.status).to.be.equal('error')
		})
	})

	describe('Test de Sessions', function (){
		let cookie
		let userCredentials
		let userMock

		beforeEach(function(){
			userMock = {
				first_name: 'Nombre',
				last_name: 'Apellido',
				email: `supertest_${ (new Date()).getTime() }@mail.com`,
				age: 21,
				password:'1234'
			}
		})

		afterEach(function(){
			userMock = null
			userCredentials = null
		})

		it('el endpoint POST /api/sessions/register debe registrar correctamente el usuario', async function (){
			const {
				statusCode,
				_body
			} = await requester.post('/api/sessions/register').send(userMock)

			expect(statusCode).to.be.equal(201)
			expect(_body.status).to.be.equal('success')
		})

		it('el endpoint POST /api/sessions/register no debe registrar a el usuario por falta de campo', async function (){
			delete userMock.last_name
			const {statusCode} = await requester.post('/api/sessions/register').send(userMock)

			expect(statusCode).to.be.equal(401)
		})

		it('el endpoint POST /api/sessions/login debe loguear correctamente el usuario y devolver una Cookie', async function (){
			userCredentials = {
				email:'supertest@gmail.com',
				password:'qwerty'
			}
			const {
				header,
				statusCode,
				_body
			} = await requester.post('/api/sessions/login').send(userCredentials)

			expect(statusCode).to.be.equal(201)
			expect(_body.status).to.be.equal('success')
			const authTokenCookie = header['set-cookie'][0]
			cookie = {
				name: authTokenCookie.split('=')[0],
				value: authTokenCookie.split('=')[1]
			}
			expect(cookie.name).to.be.ok.and.eql('authTokenCookie')
			expect(cookie.value).to.be.ok
		})


	})
})