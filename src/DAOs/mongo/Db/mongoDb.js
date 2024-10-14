const mongoose = require('mongoose')



class MongoSingleton {
    static instance
    static MONGODE_CONNECT
    constructor() {
        MongoSingleton.MONGODE_CONNECT = `mongodb+srv://matimartinezz927:Agosto92@cluster0.1dpefja.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0`
		mongoose.connect(MongoSingleton.MONGODE_CONNECT, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        })
    }

    static getConnection(settings) {
        if (this.instance) {
            console.log('Ya existe una conexión a la base de datos')

            return this.instance
        }

        this.instance = new MongoSingleton(settings)
        console.log(`Conectado a la base de datos ecommerce`)

        return this.instance
    }
}

module.exports = MongoSingleton