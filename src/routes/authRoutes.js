const express    = require('express');
const { body }   = require('express-validator');
const controller = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// VALIDATION RULES

const registerRules = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters'),

    body('email')
        .isEmail()
        .withMessage('Please provide a valid email'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
];

const loginRules = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email'),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

//  ROUTES

// PUBLIC routes — no token needed
router.post('/register', registerRules, controller.registerUser);
router.post('/login',    loginRules,    controller.loginUser);

// PROTECTED route — token required
// authMiddleware runs BEFORE controller
// If token invalid → authMiddleware returns 401, controller never runs

router.get('/profile', authMiddleware, controller.getProfile);

module.exports = router;
