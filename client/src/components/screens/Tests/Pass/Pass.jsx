import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TestService from './../../../../services/TestService';
import styles from './Pass.module.css';

const Pass = () => {
  const { startingLink } = useParams();
  const [testData, setTestData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [user, setUser] = useState(null);
  const [mail, setMail] = useState(null);
  const [testId, setTestId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    TestService.getTestByStartingLink(startingLink)
      .then(response => {
        setTestData(response.data);
        setUser(response.data.userId);
        setMail(response.data.recipientEmail);
        setTestId(response.data.testId);
        console.log('Received test data:', response.data, user, mail, testId);
      })
      .catch(error => {
        console.error('Error fetching test data:', error);
        navigate('/404');
      });
  }, [startingLink, navigate]);

  const handleCheckboxChange = (questionIndex, optionIndex) => {
    setSelectedOptions(prevState => ({
      ...prevState,
      [questionIndex]: {
        ...(prevState[questionIndex] || {}),
        [optionIndex]: !prevState[questionIndex]?.[optionIndex],
      },
    }));
  };

  const handleRatingChange = (groupId, questionIndex, rating) => {
    setSelectedOptions(prevState => ({
      ...prevState,
      [groupId]: {
        ...(prevState[groupId] || {}),
        [questionIndex]: {
          rating: rating,
        },
      },
    }));
  };

  const submitTest = async () => {
    const resultsArray = updatedTest.questions.map((question, questionIndex) => ({
      questionIndex: questionIndex,
      questionText: question.questionText,
      options: question.options.map(option => ({
        optionText: option.optionText,
        selected: option.selected,
      })),
    }));

    const results = {
      testId: testId,
      recipient: mail,
      userId: user,
      results: resultsArray,
    };

    try {
      console.log(results);
      const response = await TestService.sendTestResult(results);
      console.log('Test results submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting test results:', error);
    }
  };

  const submitCompTest = async () => {
    if (!testData.test.test.groups) {
      console.error('Groups data is not available');
      return;
    }

    const resultsArray = testData.test.test.groups.map((group, groupIndex) => {
      // Проверка на существование свойства questions
      if (!group.questions) {
        console.error(`Questions data is not available for group ${group.groupName}`);
        return null;
      }

      // Считаем среднее значение выбранных ответов для каждой группы
      const userAverageScore = group.questions.reduce((total, question, questionIndex) => {
        const answer = selectedOptions[group.groupName]?.[questionIndex]?.rating;
        return total + (answer ? parseFloat(answer) : 0);
      }, 0) / group.questions.length;

      return {
        groupName: group.groupName,
        desiredAverageScore: group.desiredAverageScore,
        userAverageScore: Math.round(userAverageScore * 100) / 100, // Округляем до сотых
        questions: group.questions.map((question, questionIndex) => {
          return {
            questionIndex: questionIndex,
            questionText: question.questionText,
            // score: question.score,
            answer: selectedOptions[group.groupName]?.[questionIndex]?.rating || null,
          };
        }),
      };
    });

    // Фильтруем результаты, чтобы убрать null
    const filteredResultsArray = resultsArray.filter(result => result !== null);

    const results = {
      testId: testId,
      recipient: mail,
      userId: user,
      results: filteredResultsArray,
    };

    try {
      console.log(results);
      const response = await TestService.sendTestResult(results);
      console.log('Test results submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting test results:', error);
    }
  };

  if (!testData) {
    return <div>Loading...</div>;
  }

  const { test } = testData;

  if (testData.test.test.testType === 'comp') {
    const compTest = testData.test.test;
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>{compTest.testName}</h2>
          {compTest.groups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {group.questions.map((question, questionIndex) => (
                <div key={`${groupIndex}-${questionIndex}`}>
                  <p>{question.questionText}</p>
                  <select value={selectedOptions[group.groupName]?.[questionIndex]?.rating || ''} onChange={(e) => handleRatingChange(group.groupName, questionIndex, e.target.value)}>
                    <option value="">Выберите оценку</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
              ))}
            </div>
          ))}
          <button className={styles.btn} onClick={submitCompTest}>Закончить тест</button>
        </div>
      </div>
    );
  }

  const updatedTest = {
    ...test.test,
    questions: test.test.questions.map((question, questionIndex) => ({
      ...question,
      options: question.options.map((option, optionIndex) => ({
        ...option,
        selected: selectedOptions[questionIndex]?.[optionIndex] || false,
      })),
    })),
  };

  console.log('Updated Test:', updatedTest);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>{updatedTest.testName}</h2>
        {updatedTest.questions.map((question, index) => (
          <div key={index}>
            {index + 1 + `) `}
            <span className={styles.questionTitle}>{question.questionText}</span>
            <ul>
              {question.options.map((option, optionIndex) => (
                <li key={optionIndex}>
                  <label className={styles.label}>
                    <input
                      className={styles.realCheckBox}
                      type="checkbox"
                      checked={selectedOptions[index]?.[optionIndex] || false}
                      onChange={() => handleCheckboxChange(index, optionIndex)}
                    />
                    <span className={styles.customCheckBox} />
                    {option.optionText}
                  </label>
                </li>
              ))}
            </ul>
            {index < updatedTest.questions.length - 1 && <br />}
          </div>
        ))}
        <button className={styles.btn} onClick={submitTest}>Закончить тест</button>
      </div>
    </div>
  );
};

export default Pass;
