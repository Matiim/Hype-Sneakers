const local = require('passport-local')
const UserManager = require('../DAOs/mongo/UserManagerMongo')
const userManager = new UserManager()
const {isValidPassword}=require('../utils/passwordHash')
const {generateToken} = require('../utils/jwt')

const LocalStrategy = local.Strategy;



const loginLocalStrategy = new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            let user = await userManager.getUserByEmail(email)

            if (!user) {
                return done(null, false, { message: 'The user does not exist in the system' })
            }

            if (!isValidPassword(password, user.password)) {
                return done(null, false, { message: 'Incorrect data' })
            }

            user = await userManager.userAuthenticate(user)
            const token = generateToken({
                userId: user._id,
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                cart: user.cart
            })
            user.token = token
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }
);


module.exports = loginLocalStrategy