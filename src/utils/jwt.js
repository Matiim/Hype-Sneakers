const jwt = require('jsonwebtoken')
const settings=require('../commands/commands')
const JWT_KEY = settings.jwt_key

const generateToken = (payload) => {
    const token = jwt.sign(payload, JWT_KEY, { expiresIn: '24h' })
    return token
}

module.exports = { generateToken }