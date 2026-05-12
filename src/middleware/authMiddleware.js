const jwt = require('jsonwebtoken');

//  AUTH MIDDLEWARE 

// Protects routes that require login
// Runs BEFORE controller on protected routes
//
// Flow:
// Request → authMiddleware → verifies token → sets req.user → controller
//
// How to use on any route:
// router.get('/profile', authMiddleware, controller.getProfile)
//                         ↑ add this before controller

const authMiddleware = (req, res, next) => {

    // Step 1 — Get token from request header
    // Frontend sends: Authorization: Bearer eyJhbGci...

    const authHeader = req.headers.authorization;

    if (!authHeader)
    {
        return res.status(401).json({
            success : false,
            message : 'Access denied. No token provided.',
        });
    }

    // Step 2 — Extract token
    // "Bearer eyJhbGci..." → split by space → ["Bearer", "eyJhbGci..."]
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success : false,
            message : 'Access denied. Token format: Bearer <token>',
        });
    }

    // Step 3 — Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //              ↑ checks:
        //                1. token is valid (not tampered)
        //                2. token is not expired
        //                3. token was signed with our secret
        //              Returns: { id: 1, role: 'user', iat: ..., exp: ... }

        // Step 4 — Attach user info to request

        req.user = decoded;
        //  ↑ now available in all controllers as req.user.id, req.user.role

        // Step 5 — Pass to next (controller)

        next();

    } catch (err) {

        // Token is invalid or expired
        return res.status(401).json({
            success : false,
            message : 'Invalid or expired token. Please login again.',
        });
    }
};

//  AUTHORIZATION MIDDLEWARE 

// Checks USER ROLE after authentication
// Use AFTER authMiddleware
//
// Example:
// router.delete('/user/:id', authMiddleware, authorize('admin'), controller.delete)

const authorize = (...roles) => {
    return (req, res, next) => {

        // req.user set by authMiddleware above
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success : false,
                message : `Access denied. Required role: ${roles.join(' or ')}`,
            });
        }

        next();
    };
};

module.exports = { authMiddleware, authorize };
