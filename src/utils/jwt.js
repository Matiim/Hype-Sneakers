const jwt = require('jsonwebtoken')
const settings=require('../commands/commands')
const jwt_key = require('../config/config')

const generateToken = (payload) => {
    const token = jwt.sign(payload, 'secretJwt', { expiresIn: '1h' })
    return token
}

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, 'secretJwt', (err, payload) => {
            if (err) {
                return reject(err)
            }

            return resolve(payload)
        })
    })
}

module.exports = { generateToken,verifyToken }