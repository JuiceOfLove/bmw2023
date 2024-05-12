import React, { useContext, useState } from 'react';
import styles from './Comp.module.css';
import { observer } from "mobx-react-lite";
import { Context } from '../../../../index';
import TestService from '../../../../services/TestService';

const Comp = () => {

  const { store } = useContext(Context);


  const [testData, setTestData] = useState({
    testName: '',
    type: 'comp',
    groups: [],
  });

  const addGroup = () => {
    setTestData(prevData => ({
      ...prevData,
      groups: [
        ...prevData.groups,
        {
          groupName: '',
          questions: [],
          desiredAverageScore: 0,
        },
      ],
    }));
  };

  const addQuestion = (groupIndex) => {
    setTestData(prevData => {
      const newGroups = [...prevData.groups];
      const updatedGroup = {
        ...newGroups[groupIndex],
        questions: [
          ...newGroups[groupIndex].questions,
          {
            questionText: '',
            // score: 1,
          }
        ]
      };
      newGroups[groupIndex] = updatedGroup;
      return { ...prevData, groups: newGroups };
    });
  };

  const removeQuestion = (groupIndex, questionIndex) => {
    setTestData(prevData => {
      const newGroups = [...prevData.groups];
      newGroups[groupIndex] = {
        ...newGroups[groupIndex],
        questions: newGroups[groupIndex].questions.filter((_, index) => index !== questionIndex)
      };
      return { ...prevData, groups: newGroups };
    });
  };

  const handleGroupChange = (groupIndex, key, value) => {
    setTestData(prevData => {
      const newGroups = [...prevData.groups];
      newGroups[groupIndex][key] = value;
      return { ...prevData, groups: newGroups };
    });
  };

  const handleQuestionChange = (groupIndex, questionIndex, key, value) => {
    setTestData(prevData => {
      const newGroups = [...prevData.groups];
      newGroups[groupIndex].questions[questionIndex][key] = value;
      return { ...prevData, groups: newGroups };
    });
  };

  const handleCreateTest = async () => {
    const userId = store.getCurrentUserId();

    try {
      const response = await TestService.createTest({
        test: {
          testName: testData.testName,
          testType: testData.type,
          groups: testData.groups,
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
      <span className={styles.testCreateTitle}>Создание теста компетенции</span>
      <label className={styles.testName}>
        <input
          placeholder='Введите название теста'
          type="text"
          value={testData.testName}
          className={styles.testName}
          onChange={(e) => setTestData({ ...testData, testName: e.target.value })}
        />
      </label>

      {testData.groups.map((group, groupIndex) => (
        <div key={groupIndex} className={styles.group}>
          <input
            placeholder='Введите тему вопросов'
            type="text"
            value={group.groupName}
            onChange={(e) => handleGroupChange(groupIndex, 'groupName', e.target.value)}
          />

          <label>
            Желаемый средний балл:
            <input
              type="number"
              value={group.desiredAverageScore}
              onChange={(e) => handleGroupChange(groupIndex, 'desiredAverageScore', parseInt(e.target.value) || 0)}
            />
          </label>

          {group.questions.map((question, questionIndex) => (
            <div key={questionIndex} className={styles.question}>
              <textarea
                placeholder='Введите текст вопроса'
                value={question.questionText}
                onChange={(e) => handleQuestionChange(groupIndex, questionIndex, 'questionText', e.target.value)}
              />

              {/* <label>
                Оценка:
                <input
                  type="number"
                  value={question.score}
                  onChange={(e) => handleQuestionChange(groupIndex, questionIndex, 'score', parseInt(e.target.value) || 0)}
                />
              </label> */}

              <button className={styles.btnDelQuestion} onClick={() => removeQuestion(groupIndex, questionIndex)}>Удалить вопрос</button>
            </div>
          ))}

          <button className={styles.btnAddQuestion} onClick={() => addQuestion(groupIndex)}>Добавить вопрос</button>
        </div>
      ))}

      <div className={styles.buttons}>
        <button className={styles.btnAddGroup} onClick={addGroup}>Добавить тему</button>
        <button className={styles.btnCreateTest} onClick={handleCreateTest}>Создать тест</button>
      </div>
    </div>
  );
};

export default observer(Comp);
