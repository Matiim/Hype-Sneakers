const EErrors = require("../service/enums");

const errorMiddleware = (error, req, res, next) => {

    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR:
        case EErrors.DATABASE_ERROR:
            res.status(500).send({ error: error })
            break;
        case EErrors.ROUTING_ERROR:
            res.status(404).send({ error: error })
            break;
        default:
            res.status(500).send({ error: 'Error no reconocido' })
    }
    next()
}

module.exports = errorMiddleware;