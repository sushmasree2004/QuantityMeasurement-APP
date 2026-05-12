const QuantityMeasurement = require('../models/QuantityMeasurement');

// ─── CONVERT TO BASE ──────────────────────────────────────────────────────────
// Equivalent of convertToBase() in ServiceImpl.java

function convertToBase(value, unit, measurementType) {

    switch (measurementType) {

        case 'LengthUnit':
            switch (unit) {
                case 'FEET'   : return value * 12;
                case 'INCHES' : return value;
                case 'YARDS'  : return value * 36;
                default: throw new Error(`Invalid length unit: ${unit}`);
            }

        case 'WeightUnit':
            switch (unit) {
                case 'KG'   : return value * 1000;
                case 'GRAM' : return value;
                default: throw new Error(`Invalid weight unit: ${unit}`);
            }

        case 'VolumeUnit':
            switch (unit) {
                case 'LITRE'      : return value * 1000;
                case 'MILLILITRE' : return value;
                default: throw new Error(`Invalid volume unit: ${unit}`);
            }

        case 'TemperatureUnit':
            switch (unit) {
                case 'CELSIUS'    : return value;
                case 'FAHRENHEIT' : return (value - 32) * 5 / 9;
                default: throw new Error(`Invalid temperature unit: ${unit}`);
            }

        default:
            throw new Error(`Invalid measurement type: ${measurementType}`);
    }
}

// ─── CONVERT FROM BASE ────────────────────────────────────────────────────────
// Equivalent of convertFromBase() in ServiceImpl.java

function convertFromBase(value, unit, measurementType) {

    switch (measurementType) {

        case 'LengthUnit':
            switch (unit) {
                case 'FEET'   : return value / 12;
                case 'INCHES' : return value;
                case 'YARDS'  : return value / 36;
                default: throw new Error(`Invalid length unit: ${unit}`);
            }

        case 'WeightUnit':
            switch (unit) {
                case 'KG'   : return value / 1000;
                case 'GRAM' : return value;
                default: throw new Error(`Invalid weight unit: ${unit}`);
            }

        case 'VolumeUnit':
            switch (unit) {
                case 'LITRE'      : return value / 1000;
                case 'MILLILITRE' : return value;
                default: throw new Error(`Invalid volume unit: ${unit}`);
            }

        case 'TemperatureUnit':
            switch (unit) {
                case 'CELSIUS'    : return value;
                case 'FAHRENHEIT' : return (value * 9 / 5) + 32;
                default: throw new Error(`Invalid temperature unit: ${unit}`);
            }

        default:
            throw new Error(`Invalid measurement type: ${measurementType}`);
    }
}

// ─── VALIDATE TYPE MATCH ──────────────────────────────────────────────────────
function validateType(a, b) {
    if (!a || !b) throw new Error('Both quantities must be provided.');
    if (a.measurementType.toLowerCase() !== b.measurementType.toLowerCase()) {
        throw new Error(`Measurement type mismatch: ${a.measurementType} vs ${b.measurementType}`);
    }
}

// ─── SAVE TO DB ───────────────────────────────────────────────────────────────
// Equivalent of saveResult() in ServiceImpl.java

async function saveResult({ a, b, result, unit, operation, resultString, isError, errorMessage }) {
    return await QuantityMeasurement.create({
        thisValue           : a?.value           ?? 0,
        thisUnit            : a?.unit            ?? null,
        thisMeasurementType : a?.measurementType ?? null,

        thatValue           : b?.value           ?? 0,
        thatUnit            : b?.unit            ?? null,
        thatMeasurementType : b?.measurementType ?? null,

        operation,
        resultValue           : result ?? 0,
        resultUnit            : unit   ?? null,
        resultMeasurementType : a?.measurementType ?? null,
        resultString          : resultString ?? null,

        isError      : isError      ?? false,
        errorMessage : errorMessage ?? null,
    });
}

// ─── ADD ──────────────────────────────────────────────────────────────────────
async function add(a, b) {
    try {
        if (a.measurementType === 'TemperatureUnit') {
            throw new Error('ADD is not supported for TemperatureUnit. Use CONVERT instead.');
        }
        validateType(a, b);
        const base   = convertToBase(a.value, a.unit, a.measurementType)
                      + convertToBase(b.value, b.unit, b.measurementType);
        const result = convertFromBase(base, a.unit, a.measurementType);
        return await saveResult({ a, b, result, unit: a.unit, operation: 'ADD' });
    } catch (err) {
        return await saveResult({ a, b, operation: 'ADD', isError: true, errorMessage: err.message });
    }
}

// ─── SUBTRACT ─────────────────────────────────────────────────────────────────
async function subtract(a, b) {
    try {
        if (a.measurementType === 'TemperatureUnit') {
            throw new Error('SUBTRACT is not supported for TemperatureUnit. Use CONVERT instead.');
        }
        validateType(a, b);
        const base   = convertToBase(a.value, a.unit, a.measurementType)
                      - convertToBase(b.value, b.unit, b.measurementType);
        const result = convertFromBase(base, a.unit, a.measurementType);
        return await saveResult({ a, b, result, unit: a.unit, operation: 'SUBTRACT' });
    } catch (err) {
        return await saveResult({ a, b, operation: 'SUBTRACT', isError: true, errorMessage: err.message });
    }
}

// ─── COMPARE ──────────────────────────────────────────────────────────────────
async function compare(a, b) {
    try {
        validateType(a, b);
        const equal = convertToBase(a.value, a.unit, a.measurementType)
                   === convertToBase(b.value, b.unit, b.measurementType);
        return await saveResult({
            a, b,
            result       : 0,
            operation    : 'COMPARE',
            resultString : equal ? 'Equal' : 'Not Equal',
        });
    } catch (err) {
        return await saveResult({ a, b, operation: 'COMPARE', isError: true, errorMessage: err.message });
    }
}

// ─── CONVERT ──────────────────────────────────────────────────────────────────
async function convert(a, target) {
    try {
        if (!target || !target.unit) {
            throw new Error('Target unit must be provided for CONVERT operation.');
        }
        const base       = convertToBase(a.value, a.unit, a.measurementType);
        const finalValue = convertFromBase(base, target.unit, a.measurementType);
        return await saveResult({ a, b: target, result: finalValue, unit: target.unit, operation: 'CONVERT' });
    } catch (err) {
        return await saveResult({ a, b: target, operation: 'CONVERT', isError: true, errorMessage: err.message });
    }
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
async function getOperationHistory(operation) {
    return await QuantityMeasurement.findAll({
        where: { operation: operation.toUpperCase() },
        order: [['createdAt', 'DESC']],
    });
}

async function getErrorHistory() {
    return await QuantityMeasurement.findAll({
        where: { isError: true },
        order: [['createdAt', 'DESC']],
    });
}

async function getOperationCount(operation) {
    return await QuantityMeasurement.count({
        where: { operation: operation.toUpperCase() },
    });
}

module.exports = { add, subtract, compare, convert, getOperationHistory, getErrorHistory, getOperationCount };
