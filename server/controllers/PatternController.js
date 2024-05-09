import { validationResult } from 'express-validator';
import PatternService from '../service/patternService.js';
import ApiError from '../exceptions/apiError.js';


export const getPatterns = async (req, res, next) => {
    try {
        const patterns = await PatternService.getPatterns();
        return res.json(patterns);
    } catch (e) {
        next(e);
    }
};

export const getPatternById = async (req, res, next) => {
    try {
        const { patternId } = req.params;
        const pattern = await PatternService.getPatternById(patternId);
        return res.json(pattern);
    } catch (e) {
        next(e);
    }
};

export const createPattern = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('Validation errors:', errors.array());
            return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
        }

        const { pattern, userId } = req.body;
        const createdPattern = await PatternService.createPattern(pattern, userId);

        return res.json(createdPattern);
    } catch (e) {
        next(e);
    }
};
