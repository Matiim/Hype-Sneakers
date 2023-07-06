const { Router } = require("express");
const productRouter = Router();

const ProductManager = require("../controllers/productManager");
const manager = new ProductManager("./products.json");

//ANDAN
productRouter.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const products = await manager.getProducts();

    if (!limit) {
      return res.send(products);
    }

    const limitProducts = products.slice(0, limit);
    return res.send(limitProducts);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
  }
});
// trae el producto segun su id
productRouter.get("/:pid", async (req, res) => {
	const pid = parseInt(req.params.pid)
    const product = await manager.getProductById(pid)

     if (!product) {
        return res.status(404).json({
            Error:"El producto no existe"
        })
    }

    return res.send(product)
})

productRouter.post("/", async (req, res) => {
	const newProduct = req.body
    const product = await manager.addProduct(newProduct)
    if (!product) {
        return res.send({
            Error:"No se pudo agregar el producto"
        })
    }
    return res.send(product)
});
productRouter.put("/:pid", async (req, res) => {
	const pid = parseInt(req.params.pid)
    const data= req.body
    const product = await manager.updateProduct(pid, data)
    console.log(product)

    if (!product) {
    return res.status(404).json({
         Error:"El producto que quiere modificar no existe"
        })
    }

    return res.send(product)
});
productRouter.delete("/:pid", async (req, res) => {
	const pid = parseInt(req.params.pid)
	const product =await manager.deleteProduct(pid)
	console.log(product)
	if (!product) {
		return res.status(404).json({
			Error:"El producto no existe"
		})
	}
	return res.send('Producto eliminado')
});

module.exports = productRouter;
