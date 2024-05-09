import User from '../models/models.js';
import Test from '../models/test.js';
import Sended from '../models/sended.js';
import ApiError from '../exceptions/apiError.js';
import Results from '../models/results.js';

class TestService {
    async createTest(test, userId) {
        try {
            const createdTest = await Test.create({ test, userId }, { include: User });
            return createdTest;
        } catch (error) {
            console.error('Error in createTest:', error);
            throw ApiError.InternalServerError('Ошибка при создании теста');
        }
    }

    async getAllTests() {
        try {
            const tests = await Test.findAll();
            return tests;
        } catch (error) {
            console.error('Error in tests:', error);
            throw ApiError.InternalServerError('Ошибка при получении шаблонов');
        }
    }

    async getTestById(id) {
        const test = await Test.findByPk(id);
        if (!test) {
            throw ApiError.NotFound(`Тест с ID ${id} не найден`);
        }
        return test;
    }

    async getResultById(id) {
        const test = await Results.findByPk(id);
        if (!test) {
            throw ApiError.NotFound(`Тест с ID ${id} не найден`);
        }
        return test;
    }

    async getTestByStartingLink(startingLink) {
        try {
          const sendedTest = await Sended.findOne({
            where: { startingLink: startingLink },
          });

          if (!sendedTest) {
            throw ApiError.NotFound(`Test with startingLink ${startingLink} not found`);
          }

          return sendedTest; // Returning the entire Sended model instance
        } catch (error) {
          console.error('Error in getTestByStartingLink:', error);
          throw ApiError.InternalServerError('Error fetching test by startingLink');
        }
      }

      async getAllResults() {
        try {
            const results = await Results.findAll();
            return results;
        } catch (error) {
            console.error('Error in results:', error);
        }
    }
}

export default new TestService();
