const express    = require('express');
const { body }   = require('express-validator');
const controller = require('../controllers/quantityController');

const router = express.Router();

// ─── VALIDATION RULES ────────────────────────────────────────────────────────
// Equivalent of @Valid + @NotNull on QuantityInputDTO fields

const quantityRules = [
    body('thisQuantityDTO').notEmpty().withMessage('thisQuantityDTO is required'),
    body('thisQuantityDTO.value').isNumeric().withMessage('thisQuantityDTO.value must be a number'),
    body('thisQuantityDTO.unit').notEmpty().withMessage('thisQuantityDTO.unit is required'),
    body('thisQuantityDTO.measurementType').notEmpty().withMessage('thisQuantityDTO.measurementType is required'),

    body('thatQuantityDTO').notEmpty().withMessage('thatQuantityDTO is required'),
    body('thatQuantityDTO.value').isNumeric().withMessage('thatQuantityDTO.value must be a number'),
    body('thatQuantityDTO.unit').notEmpty().withMessage('thatQuantityDTO.unit is required'),
    body('thatQuantityDTO.measurementType').notEmpty().withMessage('thatQuantityDTO.measurementType is required'),
];

const convertRules = [
    body('thisQuantityDTO').notEmpty().withMessage('thisQuantityDTO is required'),
    body('thisQuantityDTO.value').isNumeric().withMessage('thisQuantityDTO.value must be a number'),
    body('thisQuantityDTO.unit').notEmpty().withMessage('thisQuantityDTO.unit is required'),
    body('thisQuantityDTO.measurementType').notEmpty().withMessage('thisQuantityDTO.measurementType is required'),

    body('targetQuantityDTO').notEmpty().withMessage('targetQuantityDTO is required'),
    body('targetQuantityDTO.unit').notEmpty().withMessage('targetQuantityDTO.unit is required'),
];

// ─── ROUTES ───────────────────────────────────────────────────────────────────

router.post('/add',      quantityRules, controller.add);
router.post('/subtract', quantityRules, controller.subtract);
router.post('/compare',  quantityRules, controller.compare);
router.post('/convert',  convertRules,  controller.convert);

router.get('/history/:operation', controller.history);
router.get('/errors',             controller.errorHistory);
router.get('/count/:operation',   controller.operationCount);

module.exports = router;
