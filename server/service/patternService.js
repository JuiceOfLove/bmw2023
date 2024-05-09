import User from '../models/models.js';
import Pattern from '../models/pattern.js';
import ApiError from '../exceptions/apiError.js';

class PatternService {
    async createPattern(pattern, userId) {
        try {
            const createdPattern = await Pattern.create({ pattern, userId }, { include: User });
            return createdPattern;
        } catch (error) {
            console.error('Error in createPattern:', error);
            throw ApiError.InternalServerError('Ошибка при создании теста');
        }
    }

    async getPatterns() {
        try {
            const patterns = await Pattern.findAll();
            return patterns;
        } catch (error) {
            console.error('Error in getPatterns:', error);
            throw ApiError.InternalServerError('Ошибка при получении шаблонов');
        }
    }


    async getPatternById(patternId) {
        try {
            // Fetch pattern by ID from the database or wherever it is stored
            const pattern = await Pattern.findByPk(patternId); // Adjust this based on your data source
            return pattern;
        } catch (error) {
            console.error('Error in getPatternById:', error);
            throw ApiError.InternalServerError('Ошибка при получении данных шаблона');
        }
    }
}

export default new PatternService();
