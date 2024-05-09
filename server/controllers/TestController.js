import { validationResult } from 'express-validator';
import TestService from '../service/testService.js';
import ApiError from '../exceptions/apiError.js';
import MailService from '../service/mailService.js';
import Sended from '../models/sended.js';
import Results from '../models/results.js';
import { v4 as uuidv4 } from 'uuid';

export const createTest = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('Validation errors:', errors.array());
            return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
        }

        const { test, userId } = req.body;
        const createdTest = await TestService.createTest(test, userId);

        return res.json(createdTest);
    } catch (e) {
        next(e);
    }
};

export const sendTest = async (req, res, next) => {
    try {
        const { userId, testId, recipientEmail, recipientName, duration } = req.body;

        // Check if the test exists
        const test = await TestService.getTestById(testId);

        if (!test) {
            throw ApiError.NotFound('Test not found');
        }

        const startingLink = uuidv4();

        const sendedTest = await Sended.create({
            testId: testId,
            test: removeIsCorrectFromTest(test),
            userId: userId,
            recipientEmail: recipientEmail,
            recipientName: recipientName,
            startingLink: startingLink,
            duration: duration,
            started: true,
        });

        await MailService.sendTestMail(recipientEmail, sendedTest, `${process.env.CLIENT_URL}/pass/${startingLink}`);

        return res.json({ message: 'Test sent successfully' });
    } catch (e) {
        next(e);
    }
};

const removeIsCorrectFromTest = (sendedTest) => {
    const modifiedTest = { ...sendedTest.dataValues.test };

    if (modifiedTest.questions) {
      modifiedTest.questions.forEach((question) => {
        if (question.options) {
          question.options.forEach((option) => {
            delete option.isCorrect;
          });
        }
      });
    }

    return {
      id: sendedTest.id,
      test: modifiedTest,
      createdAt: sendedTest.createdAt,
      updatedAt: sendedTest.updatedAt,
      userId: sendedTest.userId,
    };
  };

  export const sendCompTest = async (req, res, next) => {
    try {
        const { userId, testId, recipientEmail, recipientName, duration } = req.body;

        // Check if the test exists
        const test = await TestService.getTestById(testId);

        if (!test) {
            throw ApiError.NotFound('Test not found');
        }

        const startingLink = uuidv4();

        const sendedTest = await Sended.create({
            testId: testId,
            test: test,
            userId: userId,
            recipientEmail: recipientEmail,
            recipientName: recipientName,
            startingLink: startingLink,
            duration: duration,
            started: true,
        });

        await MailService.sendTestMail(recipientEmail, sendedTest, `${process.env.CLIENT_URL}/pass/${startingLink}`);

        return res.json({ message: 'Test sent successfully' });
    } catch (e) {
        next(e);
    }
};

export const getAllTests = async (req, res, next) => {
    try {
        const tests = await TestService.getAllTests();
        return res.json(tests);
    } catch (e) {
        next(e);
    }
};

export const getTestByStartingLink = async (req, res, next) => {
    try {
      const { startingLink } = req.params;

      const test = await TestService.getTestByStartingLink(startingLink);

      if (!test) {
        throw ApiError.NotFound('Test not found');
      }

      return res.json(test);
    } catch (e) {
      next(e);
    }
  };

  export const submitTestResults = async (req, res, next) => {
    try {
      const { results, testId, userId, recipient } = req.body;

      const originalTest = await TestService.getTestById(testId);

      if (!originalTest) {
          throw ApiError.NotFound(`Test with ID ${testId} not found`);
      }

      const updatedResults = results.map((result) => {
          if (!result.options || !Array.isArray(result.options)) {
              return result;
          }

          const updatedOptions = result.options.map((option) => {
              const originalOption = originalTest.test.questions[result.questionIndex].options.find(o => o.optionText === option.optionText);

              const isCorrect = originalOption.isCorrect;
              const selected = option.selected;

              if (selected === true && isCorrect === true) {
                  return { ...option, result: 'right' };
              } else if (selected === true && isCorrect === false) {
                  return { ...option, result: 'false' };
              } else if (selected === false && isCorrect === true){
                  return { ...option, selected: false, result: 'missed' };
              }
                else {
                  return { ...option, selected: false, result: 'pass' };
              }
          });

          return { ...result, options: updatedOptions };
      });

      await Results.create({
          testId: testId,
          test: updatedResults,
          userId: userId,
          recipient: recipient,
      });

      return res.json({ message: 'Test results submitted successfully' });
    } catch (error) {
      console.error('Error in submitTestResults:', error);
      next(error);
    }
  };

  export const getAllResults = async (req, res, next) => {
    try {
        const results = await TestService.getAllResults();
        return res.json(results);
    } catch (e) {
        next(e);
    }
};

export const getResultById = async (req, res, next) => {
  try {
      const { id } = req.params;
      console.log(id)
      const test = await TestService.getResultById(id);
      return res.json(test);
  } catch (e) {
      next(e);
  }
};