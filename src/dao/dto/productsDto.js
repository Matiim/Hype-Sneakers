class ProductsDto{
	constructor(products){
		this.products = products.docs
		this.totalPages = products.totalPages
		this.prevPage = products.prevPage
		this.nextPage = products.nextPage
		this.hastPrevPage = products.hastPrevPage
		this.hastNextPage = products.hastNextPage
		this.prevLink = products.prevPage
		this.nextLink = products.nextPage
	}
}

module.exports = ProductsDto