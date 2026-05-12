const jwt = require('jsonwebtoken');

//  GENERATE JWT TOKEN 
// Called after successful login/register
// Returns a signed JWT token string

const generateToken = (userId, role) => {

    return jwt.sign(

        // PAYLOAD — data stored inside token
        {
            id   : userId,
            role : role,
        },

        // SECRET KEY — from .env
        process.env.JWT_SECRET,

        // OPTIONS
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        }

    );
};

module.exports = generateToken;

//  HOW JWT TOKEN WORKS 
//
// jwt.sign() creates a token with 3 parts:
//
// HEADER.PAYLOAD.SIGNATURE
//
// Example token:
// eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwicm9sZSI6InVzZXIifQ.abc123
//
// HEADER   → algorithm used (HS256)
// PAYLOAD  → { id: 1, role: "user" } ← what we store
// SIGNATURE → hash of header+payload+secret ← tamper proof
//
// Anyone can READ the payload (it's base64 encoded, not encrypted)
// But they CANNOT MODIFY it without knowing the secret
