const jwt = require('jsonwebtoken');

const SECRET_KEY = 'my-super-special-secret-key-that-i-am-not-going-to-tell-anyone-heheheha';

const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if(!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user.email;
    next();
  });
};

module.exports = { generateToken, authenticateJWT };
