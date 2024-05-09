import React, { useState, useContext } from 'react';
import PatternService from './../../../../services/PatternService';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../../index';
import styles from './PatternCreate.module.css';

const PatternCreate = () => {
  const [patternData, setPatternData] = useState({
    patternName: '',
    questions: [
      {
        type: 1,
        questionText: '',
        options: [{ id: 1, optionText: '', isCorrect: false }],
      },
    ],
  });

  const { store } = useContext(Context);

  const addQuestion = () => {
    setPatternData((prevData) => ({
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
    setPatternData((prevData) => {
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
    setPatternData((prevData) => {
      const newQuestions = [...prevData.questions];
      const newOptions = newQuestions[questionIndex].options.filter((option) => option.id !== optionId);

      if (newOptions.length > 0) {
        newQuestions[questionIndex].options = newOptions;
      }

      return { ...prevData, questions: newQuestions };
    });
  };

  const removeQuestion = (questionIndex) => {
    setPatternData((prevData) => {
      const newQuestions = prevData.questions.filter((_, index) => index !== questionIndex);
      return { ...prevData, questions: newQuestions };
    });
  };

  const handleCheckboxChange = (questionIndex, optionIndex) => {
    setPatternData((prevData) => {
      const newQuestions = JSON.parse(JSON.stringify(prevData.questions));
      newQuestions[questionIndex].options.forEach((option, idx) => {
        option.isCorrect = idx === optionIndex;
      });
      return { ...prevData, questions: newQuestions };
    });
  };

  const handleCreatePattern = async () => {
    const userId = store.getCurrentUserId();

    try {
      const filteredQuestions = patternData.questions.map((question) => {
        if (question.type === 2) {
          const { cost, ...questionWithoutCost } = question;
          return questionWithoutCost;
        }
        return question;
      });

      const response = await PatternService.createPattern({
        pattern: {
          patternName: patternData.patternName,
          questions: filteredQuestions,
        },
        userId: userId,
      });
      console.log('Шаблон успешно создан:', response.data);
    } catch (error) {
      console.error('Ошибка при создании шаблона:', error.response?.data?.message);
    }
  };

  return (
    <div className={styles.container}>
      <label>
        Название шаблона:
        <input
          type="text"
          value={patternData.patternName}
          onChange={(e) => setPatternData({ ...patternData, patternName: e.target.value })}
        />
      </label>

      {patternData.questions.map((question, questionIndex) => (
        <div key={questionIndex} className={styles.questionContainer}>
          <label>
            Вопрос {questionIndex + 1}:
            <textarea
              value={question.questionText}
              onChange={(e) => {
                setPatternData((prevData) => {
                  const newQuestions = [...prevData.questions];
                  newQuestions[questionIndex].questionText = e.target.value;
                  return { ...prevData, questions: newQuestions };
                });
              }}
            />
          </label>

          {question.type !== 2 && (
            <label>
              Стоимость вопроса:
              <input
                type="number"
                value={isNaN(question.cost) ? '' : question.cost}
                onChange={(e) => {
                  setPatternData((prevData) => {
                    const newQuestions = [...prevData.questions];
                    newQuestions[questionIndex].cost = parseInt(e.target.value) || 0;
                    return { ...prevData, questions: newQuestions };
                  });
                }}
              />
            </label>
          )}

          <label>
            Выберите тип вопроса:
            <select
              value={question.type}
              onChange={(e) => {
                setPatternData((prevData) => {
                  const newQuestions = [...prevData.questions];
                  newQuestions[questionIndex].type = parseInt(e.target.value);
                  return { ...prevData, questions: newQuestions };
                });
              }}
            >
              <option value={1}>Вопрос с вариантами ответов</option>
              <option value={2}>Вопрос с вводом текста</option>
            </select>
          </label>

          {question.type === 1 && (
            <div className={styles.optionsContainer}>
              <label>
                Варианты ответов:
                {question.options.map((option, optionIndex) => (
                  <div key={option.id} className={styles.option}>
                    <input
                      type="text"
                      value={option.optionText}
                      onChange={(e) => {
                        setPatternData((prevData) => {
                          const newQuestions = [...prevData.questions];
                          const newOptions = [...newQuestions[questionIndex].options];
                          newOptions[optionIndex].optionText = e.target.value;
                          newQuestions[questionIndex].options = newOptions;
                          return { ...prevData, questions: newQuestions };
                        });
                      }}
                    />
                    <label>
                      Правильный ответ:
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={() => handleCheckboxChange(questionIndex, optionIndex)}
                      />
                    </label>
                    <button onClick={() => removeOption(questionIndex, option.id)} className={styles.removeOptionButton}>
                      &#10060;
                    </button>
                  </div>
                ))}
                <button onClick={() => addOption(questionIndex)} className={styles.addOptionButton}>
                  Добавить вариант ответа
                </button>
              </label>
            </div>
          )}

          <div className={styles.buttonsContainer}>
            <button onClick={() => removeQuestion(questionIndex)} className={styles.removeQuestionButton}>
              Удалить вопрос
            </button>
          </div>
        </div>
      ))}

      <div className={styles.buttonsContainer}>
        <button onClick={addQuestion} className={styles.addQuestionButton}>
          Добавить вопрос
        </button>
        <button onClick={handleCreatePattern} className={styles.createPatternButton}>
          Создать тест
        </button>
      </div>
    </div>
  );
};

export default observer(PatternCreate);
