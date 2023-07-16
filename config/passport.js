const passport = require('passport')
const passportJWT = require('passport-jwt')

const { User } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, (jwtPayload, done) => {
  User.findByPk(jwtPayload.id)
    .then(user => done(null, user))
    .catch(err => done(err, false))
}))

module.exports = passport