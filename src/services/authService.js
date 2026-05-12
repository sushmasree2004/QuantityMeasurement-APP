const bcrypt        = require('bcrypt');
const User          = require('../models/User');
const generateToken = require('../utils/generateToken');

// REGISTER

const register = async ({ name, email, password }) => {

    // Step 1 — Check if email already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
        const err    = new Error('Email already registered');
        err.status   = 409;   // 409 Conflict
        throw err;
    }

    // Step 2 — Hash the password
    // bcrypt.hash(plainPassword, saltRounds)
    // saltRounds = 10 → how many times to process (higher = more secure but slower)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3 — Save user to DB with hashed password
    // NEVER save plain password
    const user = await User.create({
        name,
        email,
        password : hashedPassword,
    });

    // Step 4 — Generate JWT token
    const token = generateToken(user.id, user.role);

    // Step 5 — Return user info + token
    // NOTE: never return password field back to client
    return {
        id    : user.id,
        name  : user.name,
        email : user.email,
        role  : user.role,
        token,
    };
};

// LOGIN

const login = async ({ email, password }) => {

    // Step 1 — Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
        const err  = new Error('Invalid credentials');
        err.status = 401;   // 401 Unauthorized
        throw err;
    }

    // Step 2 — Compare entered password with hashed password in DB
    // bcrypt.compare(plainPassword, hashedPassword)
    // Returns true if they match
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        const err  = new Error('Invalid credentials');
        err.status = 401;
        throw err;
    }

    // Step 3 — Generate JWT token
    const token = generateToken(user.id, user.role);

    // Step 4 — Return user info + token
    return {
        id    : user.id,
        name  : user.name,
        email : user.email,
        role  : user.role,
        token,
    };
};

//  GET PROFILE 

const getProfile = async (userId) => {

    const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] },  // never return password
    });

    if (!user) {
        const err  = new Error('User not found');
        err.status = 404;
        throw err;
    }

    return user;
};

module.exports = { register, login, getProfile };
