const passport = require('../config/passport')

const authenticated = [
  passport.authenticate('jwt', { session: false }),
  (err, user, req, res, next) => {
    if (err || !user) return res.status(401).json({
      status: 'error',
      message: 'Unauthorized'
    })
    req.user = user.toJSON()
    next()
  }
]


module.exports = { authenticated }