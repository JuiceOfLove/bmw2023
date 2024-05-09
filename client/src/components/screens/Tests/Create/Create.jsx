import React, { useState, useContext, useEffect } from 'react';
import TestService from './../../../../services/TestService';
import PatternService from './../../../../services/PatternService';
import { observer } from "mobx-react-lite";
import { Context } from '../../../../index';

import styles from './Create.module.css'
import basket from './../../../../assets/icons/basket.svg'

const Create = () => {
  const [selectedPatternId, setSelectedPatternId] = useState('');
  const [patternQuestionsCount, setPatternQuestionsCount] = useState(0);
  const [selectedPatternQuestions, setSelectedPatternQuestions] = useState([]);
  const [randomQuestionsCount, setRandomQuestionsCount] = useState(0);
  const [patterns, setPatterns] = useState([]);
  const [testData, setTestData] = useState({
    testName: '',
    questions: [
      {
        type: 1,
        questionText: '',
        options: [{ id: 1, optionText: '', isCorrect: false }],
      },
    ],
  });

  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const response = await PatternService.getPatterns();
        setPatterns(response.data);
        console.log('Паттерны:', response.data);
      } catch (error) {
        console.error('Ошибка при получении списка шаблонов:', error);
      }
    };

    fetchPatterns();
  }, []);

  const handlePatternChange = async (patternId) => {
    try {
      if (patternId) {
        const response = await PatternService.getPatternById(patternId);
        const patternData = response.data.pattern;

        if (patternData && patternData.questions) {
          setPatternQuestionsCount(patternData.questions.length);
          setSelectedPatternQuestions(patternData.questions);
        } else {
          console.error('Ошибка: отсутствуют данные о вопросах в выбранном паттерне.');
        }
      } else {
        setPatternQuestionsCount(0);
        setSelectedPatternQuestions([]);
      }
    } catch (error) {
      console.error('Ошибка при получении данных шаблона:', error);
    }
  };

  const handleCreateTestWithRandomQuestions = () => {
    if (randomQuestionsCount > 0 && selectedPatternQuestions.length > 0) {
      const randomQuestions = [];
      const availableQuestions = [...selectedPatternQuestions];

      for (let i = 0; i < Math.min(randomQuestionsCount, availableQuestions.length); i++) {
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const randomQuestion = { ...availableQuestions[randomIndex] };

        // Remove 'cost' property for type 2 questions
        if (randomQuestion.type === 2) {
          delete randomQuestion.cost;
        }

        randomQuestions.push(randomQuestion);
        availableQuestions.splice(randomIndex, 1);
      }

      setTestData((prevData) => ({
        ...prevData,
        questions: [...prevData.questions, ...randomQuestions],
      }));
    }
  };

  const { store } = useContext(Context);

  const addQuestion = () => {
    setTestData((prevData) => ({
      ...prevData,
      questions: [
        ...prevData.questions,
        {
          type: 1,
          questionText: '',
          options: [{ id: 1, optionText: '', isCorrect: false }],
        },
      ],
    }));
  };

  const addOption = (questionIndex) => {
    setTestData((prevData) => {
      const newQuestions = [...prevData.questions];
      const newOptions = [...newQuestions[questionIndex].options];
      const lastOption = newOptions[newOptions.length - 1];

      if (lastOption && lastOption.optionText.trim() !== '') {
        const newId = lastOption.id + 1;
        newOptions.push({ id: newId, optionText: '', isCorrect: false });
        newQuestions[questionIndex].options = newOptions;
      }

      return { ...prevData, questions: newQuestions };
    });
  };

  const removeOption = (questionIndex, optionId) => {
    setTestData((prevData) => {
      const newQuestions = [...prevData.questions];
      const newOptions = newQuestions[questionIndex].options.filter((option) => option.id !== optionId);

      if (newOptions.length > 0) {
        newQuestions[questionIndex].options = newOptions;
      }

      return { ...prevData, questions: newQuestions };
    });
  };

  const removeQuestion = (questionIndex) => {
    setTestData((prevData) => {
      const newQuestions = prevData.questions.filter((_, index) => index !== questionIndex);
      return { ...prevData, questions: newQuestions };
    });
  };

  const handleCheckboxChange = (questionIndex, optionIndex) => {
    setTestData((prevData) => {
      const newQuestions = JSON.parse(JSON.stringify(prevData.questions));
      newQuestions[questionIndex].options[optionIndex].isCorrect = !newQuestions[questionIndex].options[optionIndex].isCorrect;
      return { ...prevData, questions: newQuestions };
    });
  };

  const handleCreateTest = async () => {
    const userId = store.getCurrentUserId();

    try {
      const response = await TestService.createTest({
        test: {
          testName: testData.testName,
          questions: testData.questions,
        },
        userId: userId,
      });
      console.log('Тест успешно создан:', response.data);
    } catch (error) {
      console.error('Ошибка при создании теста:', error.response.data.message);
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.labelPattern}>
        <select
          value={selectedPatternId}
          className={styles.selectPattern}
          onChange={(e) => {
            setSelectedPatternId(e.target.value);
            handlePatternChange(e.target.value);
          }}
        >
          <option value="">Добавить шаблон</option>
          {patterns.map((patternData) => (
            <option key={patternData.id} value={patternData.id}>
              {patternData.pattern.patternName}
            </option>
          ))}
        </select>
      </label>

      {selectedPatternId && (
        <div>
          <p>Количество вопросов в паттерне: {patternQuestionsCount}</p>
          <label>
            Введите количество случайных вопросов:
            <input
              type="number"
              value={isNaN(randomQuestionsCount) ? '' : randomQuestionsCount}
              onChange={(e) => setRandomQuestionsCount(parseInt(e.target.value) || 0)}
            />
          </label>
          <button onClick={handleCreateTestWithRandomQuestions}>Добавить случайные вопросы</button>
        </div>
      )}

      <label className={styles.testName}>
        <input
          placeholder='Введите название теста'
          type="text"
          value={testData.testName}
          onChange={(e) => setTestData({ ...testData, testName: e.target.value })}
        />
      </label>


      {testData.questions.map((question, questionIndex) => (
        <div key={questionIndex} className={styles.questions}>
          <div className={styles.questionTitle}>
            <label className={styles.questionTitleLabel}>
              Вопрос {questionIndex + 1}:
              <input
                value={question.questionText}
                onChange={(e) => {
                  setTestData((prevData) => {
                    const newQuestions = [...prevData.questions];
                    newQuestions[questionIndex].questionText = e.target.value;
                    return { ...prevData, questions: newQuestions };
                  });
                }}
              />
            </label>
            {question.type === 1 && (
              <label className={styles.questionCost}>
                Балл:
                <input
                  type="number"
                  value={isNaN(question.cost) ? '' : question.cost}
                  onChange={(e) => {
                    setTestData((prevData) => {
                      const newQuestions = [...prevData.questions];
                      newQuestions[questionIndex].cost = parseInt(e.target.value) || 0;
                      return { ...prevData, questions: newQuestions };
                    });
                  }}
                />
              </label>
            )}
            <button className={styles.btnDelQuestion} onClick={() => removeQuestion(questionIndex)}>Удалить вопрос</button>
          </div>

          <label className={styles.questionType}>
            Выберите тип вопроса:
            <select
              value={question.type}
              onChange={(e) => {
                setTestData((prevData) => {
                  const newQuestions = [...prevData.questions];
                  newQuestions[questionIndex].type = parseInt(e.target.value);
                  // Remove 'cost' property for type 2 questions
                  if (newQuestions[questionIndex].type === 2) {
                    delete newQuestions[questionIndex].cost;
                  }
                  return { ...prevData, questions: newQuestions };
                });
              }}
            >
              <option value={1}>Вопрос с вариантами ответов</option>
              <option value={2}>Вопрос с вводом текста</option>
            </select>
          </label>

          {question.type === 1 && (
            <div>
              <label>
                Варианты ответов:
                {question.options.map((option, optionIndex) => (
                  <div key={option.id} className={styles.questionOption}>
                    <textarea
                      className={styles.questionOptionTitle}
                      type="text"
                      value={option.optionText}
                      onChange={(e) => {
                        setTestData((prevData) => {
                          const newQuestions = [...prevData.questions];
                          const newOptions = [...newQuestions[questionIndex].options];
                          newOptions[optionIndex].optionText = e.target.value;
                          newQuestions[questionIndex].options = newOptions;
                          return { ...prevData, questions: newQuestions };
                        });
                      }}
                    />
                    <label className={styles.isTrue}>
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={() => handleCheckboxChange(questionIndex, optionIndex)}
                      />
                    </label>
                    <button className={styles.btnDelOption} onClick={() => removeOption(questionIndex, option.id)}><img className={styles.basket} src={basket} alt='Удалить'></img></button>
                  </div>
                ))}
                <button className={styles.btnAddOption} onClick={() => addOption(questionIndex)}>Добавить вариант ответа</button>
              </label>
            </div>
          )}
        </div>
      ))}

      <button className={styles.btnAddQuestion} onClick={addQuestion}>Добавить вопрос</button>

      <button className={styles.btnCreateTest} onClick={handleCreateTest}>Создать тест</button>
    </div>
  );
};

export default observer(Create);
