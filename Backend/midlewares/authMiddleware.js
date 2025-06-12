import jwt from 'jsonwebtoken';

// Replace with your JWT secret key
const JWT_SECRET = process.env.JWT_SECRET_KEY || "your_jwt_secret_here";

const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    // Add user info to request object
    req.user = {
      id: decoded.id,
      username: decoded.username,
      // add any other data you encoded in the token here
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

 export{ authMiddleware};
