const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

const JWT_SECRET_KEY = process.env.JWT_SECRET;

if (!JWT_SECRET_KEY) {
    throw new Error("FATAL ERROR: JWT_SECRET is not defined! Set it in your environment variables.");
}

// Middleware to check role
const checkTokenAndRole = (role) => {
    return function (req, res, next) {
        // Get the token from the request header
        const token = req.headers["authorization"];
        
        if (!token) {
            return res.status(401).json({ error: "No token provided." });
        }

        // Extract token (remove "Bearer " prefix)
        const tokenWithoutBearer = token.startsWith("Bearer ") ? token.slice(7) : token;

        // Verify the token
        jwt.verify(tokenWithoutBearer, JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("Token verification error:", err);
                return res.status(401).json({ error: "Failed to authenticate token." });
            }

            console.log("Decoded Token:", decoded);

            // Check token expiration
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            if (decoded.exp && decoded.exp < currentTime) {
                return res.status(401).json({ error: "Token has expired." });
            }

            // Check if user has the required role
            if (!decoded.role || decoded.role !== role) {
                return res.status(403).json({ error: "You do not have permission to access this resource." });
            }

            // Save decoded token to request for later use
            req.decoded = decoded;
            next();
        });
    };
};

module.exports = { checkTokenAndRole };
