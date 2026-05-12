const { validationResult } = require('express-validator');
const service = require('../services/quantityService');

// ─── HELPER: extract validated body or throw ─────────────────────────────────
function checkValidation(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error('Validation failed');
        err.details = errors.array().map(e => `${e.path}: ${e.msg}`);
        err.status  = 400;
        throw err;
    }
}

// ─── POST /add ───────────────────────────────────────────────────────────────
// Equivalent of @PostMapping("/add")
async function add(req, res, next) {
    try {
        checkValidation(req);
        const { thisQuantityDTO, thatQuantityDTO } = req.body;
        const result = await service.add(thisQuantityDTO, thatQuantityDTO);
        res.json(result);
    } catch (err) { next(err); }
}

// ─── POST /subtract ───────────────────────────────────────────────────────────
async function subtract(req, res, next) {
    try {
        checkValidation(req);
        const { thisQuantityDTO, thatQuantityDTO } = req.body;
        const result = await service.subtract(thisQuantityDTO, thatQuantityDTO);
        res.json(result);
    } catch (err) { next(err); }
}

// ─── POST /compare ────────────────────────────────────────────────────────────
async function compare(req, res, next) {
    try {
        checkValidation(req);
        const { thisQuantityDTO, thatQuantityDTO } = req.body;
        const result = await service.compare(thisQuantityDTO, thatQuantityDTO);
        res.json(result);
    } catch (err) { next(err); }
}

// ─── POST /convert ────────────────────────────────────────────────────────────
async function convert(req, res, next) {
    try {
        checkValidation(req);
        const { thisQuantityDTO, targetQuantityDTO } = req.body;
        const result = await service.convert(thisQuantityDTO, targetQuantityDTO);
        res.json(result);
    } catch (err) { next(err); }
}

// ─── GET /history/:operation ──────────────────────────────────────────────────
async function history(req, res, next) {
    try {
        const result = await service.getOperationHistory(req.params.operation);
        res.json(result);
    } catch (err) { next(err); }
}

// ─── GET /errors ──────────────────────────────────────────────────────────────
async function errorHistory(req, res, next) {
    try {
        const result = await service.getErrorHistory();
        res.json(result);
    } catch (err) { next(err); }
}

// ─── GET /count/:operation ────────────────────────────────────────────────────
async function operationCount(req, res, next) {
    try {
        const count = await service.getOperationCount(req.params.operation);
        res.json({ operation: req.params.operation.toUpperCase(), count });
    } catch (err) { next(err); }
}

module.exports = { add, subtract, compare, convert, history, errorHistory, operationCount };
