const fs = require("fs")


class ProductManager {

    constructor (path) {
        this.products = []
        this.path =path
        
    }

    async getProducts () {
      try {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        this.products = JSON.parse(data)
        return this.products
        
      } catch (error) {
        console.error('Error al leer los productos:', error)
        this.products = []
      }
    }

    async addProduct (product) {
      try {
        await this.getProducts()
        if ( !product.title || !product.code || !product.description || !product.price || !product.thumbnail || !product.stock ) {
          console.log ("Error! todos los campos son obligatorios")
          return
        }

        const codigoRepetido = this.products.find ((element) => element.code === product.code)

      if (codigoRepetido ) {
        console.log("Codigo de producto repetido")
        return
      }

      const newProduct ={
		id :this.products.length + 1,
        title: product.title,
        description: product.description,
        code: product.code,
        price: product.price,
        status : product.status ?? true,
        stock: product.stock,
        category: product.category,
        thumbnail: product.thumbnail ?? [],
      }

      this.products.push(newProduct)
      console.log(`Se agregó un nuevo producto con el id ${newProduct.id}`)
      
      await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
      console.log('Producto guardado correctamente')
      return newProduct

      } catch (error) {
        console.log('Error al agregar el producto', error)
      }
      
    }

    async getProductById (id) {
      try {
        await this.getProducts()
        const product = this.products.find((p) => p.id === id)
        console.log(product)

        return product

      } catch (error) {
        console.log('Error al obtener el producto:', error)
      }
    }

    async updateProduct(id, data) {
       
          try {
           await this.getProducts()
            const product = this.products.find((product) => product.id === id);
            console.log(product)
      
              if (!product) {
                console.log('Error al obtener el producto:')
                return 
              }
              
                product.title = data.title || product.title
                product.description = data.description || product.description
                product.code = data.code || product.code
                product.price = data.price || product.price
                product.status = data.status || product.status
                product.stock = data.stock || product.stock
                product.thumbnail = data.thumbnail || product.thumbnail
              
            console.log(`Producto actualizado con ID ${id}`)
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
            return product

          } catch (e) {
            console.log('Error al obtener el producto:', e)
          }
    }    

    async deleteProduct(id) {
      try {
        await this.getProducts()

        const productIndex = this.products.findIndex((p) => p.id === id)
        console.log(productIndex)
        if (productIndex === -1) {
          return console.log('El producto que quiere eliminar no existe')
        }
    
        this.products.splice(productIndex, 1)
        console.log(`Se eliminó el producto con ID ${id}`)
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
        return productIndex

      } catch (error) {
        console.log('Error al eliminar el producto:', error)
      } 
  }

}const manager = new ProductManager('./products.json')

module.exports = ProductManager