const { validationResult } = require('express-validator');
const authService = require('../services/authService');




function checkValidation(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err    = new Error('Validation failed');
        err.details  = errors.array().map(e => `${e.path}: ${e.msg}`);
        err.status   = 400;
        throw err;
    }
}


// POST /api/auth/register

const registerUser = async (req, res, next) => {
    try {
        checkValidation(req);

        const { name, email, password } = req.body;

        const result = await authService.register({ name, email, password });

        // 201 Created — resource was created
        res.status(201).json({
            success : true,
            message : 'User registered successfully',
            data    : result,
        });

    } catch (err) { next(err); }
};


// POST /api/auth/login

const loginUser = async (req, res, next) => {
    try {
        checkValidation(req);

        const { email, password } = req.body;

        const result = await authService.login({ email, password });

        res.status(200).json({
            success : true,
            message : 'Login successful',
            data    : result,
        });

    } catch (err) { next(err); }
};


// GET /api/auth/profile
// Protected — needs valid JWT token

const getProfile = async (req, res, next) => {
    try {

        // req.user is set by authMiddleware after token verification
        const user = await authService.getProfile(req.user.id);

        res.status(200).json({
            success : true,
            data    : user,
        });

    } catch (err) { next(err); }
};

module.exports = { registerUser, loginUser, getProfile };
