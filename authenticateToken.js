const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = decodedToken;
      next();
    });
  } catch (error) {
    res.sendStatus(401);
  }
};

module.exports = { authenticateToken };
