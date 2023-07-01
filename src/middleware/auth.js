const jwt = require('jsonwebtoken');

const authorization = (req, res, next) => {
  try {
    const token = req.headers['x-api-key'];
    if (!token || token.trim() === '') {
      return res.status(401).json({ status: false, message: 'Invalid Token' });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ status: false, message: 'Invalid Token' });
    } else {
      return res.status(500).json({ status: false, message: error.message });
    }
  }
};

module.exports = {
  authorization,
};
