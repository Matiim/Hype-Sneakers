const fs = require("fs");

const  productManager  = require("./productManager");
const manager2 = new productManager('./products.json')

class cartManager {

    constructor (path) {
        this.carts =[]
        this.path =path
        
    }

    async getCarts () {
        try {

            if (!fs.existsSync(this.path)) {
                await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2))
                console.log(`El archivo ${this.path} fue creado correctamente`)
                return 
            }

            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.carts = JSON.parse(data)
            return this.carts
          
        } catch (error) {
          console.error('Error al leer los carritos:', error)
          
        }
      }

    async addCart () {
        try {
            await this.getCarts()

            const newCart ={
                id: this.carts.length + 1,
                products:[newProduct]  
            } 
            
        this.carts.push(newCart)
        console.log(`Se agregó un nuevo carrito con el id ${newCart.id}`)
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2))
        console.log('Carrito guardado correctamente')
        return newCart
  
        } catch (error) {
          console.log('Error al agregar el carrito', error)
        }
    }   

    async getCartsById (id) {
        try {
          await this.getCarts()
          const cart = this.carts.find((p) => p.id === id)
  
          return (cart.products)
  
        } catch (error) {
          console.log('Error al obtener el carrito:', error)
        }
    }

    async addProductInCart (cid, pid) {
        try {
            await this.getCarts()
            const products= await manager2.getProducts()
            const productId = products.find((p) => p.id === pid)

            if (!productId) {
                console.log('No se encuentra el producto con id ', pid)
                return
            }
            
            const cartId = this.carts.find((p) => p.id === cid)
            console.log("carrito es ", cartId)
            
            if (!cartId) {
                console.log('No se encuentra el carrito con id ', cid)
                return
            }

            const productRepeat = cartId.products.find(e => e.product === productId.id)

            if (productRepeat) {
               console.log("el product ya se encuentra en el carro")
               const index= cartId.products.findIndex(e => e.product === productId.id)

               const quantity = (cartId.products[index].quantity) + 1
               cartId.products[index].quantity = quantity

               await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2))
               return cartId
            }
            
            const newProduct = {
                product: productId.id,
                quantity: 1
            }

            cartId.products.push(newProduct)
            
           
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2))
        return cartId
  
        } catch (error) {
          console.log('Error al agregar el producto', error)
        }
    } 

}

const manager = new cartManager('./carrito.json')


module.exports = cartManager