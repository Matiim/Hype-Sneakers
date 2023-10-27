const EErrors = require("../service/enums");

const errorMiddleware = (error, req, res, next) => {
    console.log(error.cause)
    const contentType = req.headers['content-type']
    switch (error.code) {
        case EErrors.INVALID_TYPE_ERROR:
        case EErrors.DATABASE_ERROR:
            return res.status(500).send({ error: error })
        case EErrors.AUTHENTICATION_ERROR:
            if (contentType === 'application/json') {
                return res.status(401).send({ error: error.message })
            } else if (error.message === 'No auth token') {
                return res.redirect(`/error?errorMessage=You must be logged in`)
            } else {
                return res.redirect(`/error?errorMessage=${error.message}`)
            }
        case EErrors.AUTHORIZATION_ERROR:
            return res.redirect(`/error?errorMessage=${error.message}`)
        case EErrors.ROUTING_ERROR:
            return res.status(404).send({ error: error })
        default:
            res.status(500).send({ error: 'Unrecognized error' })
    }

    next()
}

module.exports = errorMiddleware;