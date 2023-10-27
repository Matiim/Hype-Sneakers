const winston = require ('winston')
const settings = require('../commands/commands')


const customLevelsOptions = {
	levels:{
		fatal:0,
		error:1,
		warning:2,
		info:3,
		http:4,
		debug:5
	}
}

const createLogger = () => {
    const transports = []

    if ('prod') {
        transports.push(new winston.transports.Console({ level: 'info' }))
        transports.push(new winston.transports.File({ filename: '/logs/errors.log', level: 'error' }))
    } else if ('dev') {
        transports.push(new winston.transports.Console({ level: 'debug' }));
    }

    const logger = winston.createLogger({
        levels: customLevelsOptions.levels,
        transports: transports,
        format: winston.format.combine(
            winston.format.simple()
        ),
    })
    return logger
}

const logger = createLogger()


 const addLogger = (req,res,next)=>{
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next();
}

module.exports = addLogger