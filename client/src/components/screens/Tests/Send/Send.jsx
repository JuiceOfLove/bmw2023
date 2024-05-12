import React, { useState, useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../../index';
import styles from './Send.module.css';
import TestService from '../../../../services/TestService';

const Send = () => {
    const { store } = useContext(Context);
    const [tests, setTests] = useState([]);
    const [formData, setFormData] = useState({
        userId: store.getCurrentUserId(),
        recipientEmail: '',
        recipientName: '',
        duration: '',
        selectedTest: null,
        tests: [],
        testType: 'test',
    });

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await TestService.getAllTests();
                setTests(response.data);
                setFormData((prevData) => ({ ...prevData, tests: response.data }));
                console.log('Тесты:', response.data);
            } catch (error) {
                console.error('Ошибка при получении списка тестов:', error);
            }
        };

        fetchTests();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTestSelection = (e) => {
        const selectedTestId = e.target.value;
        const selectedTest = formData.tests.find((test) => test.id === parseInt(selectedTestId));
        setFormData({ ...formData, selectedTest });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await TestService.sendTest({
                userId: formData.userId,
                testId: formData.selectedTest.id,
                recipientEmail: formData.recipientEmail,
                recipientName: formData.recipientName,
                duration: formData.duration,
            });
        } catch (error) {
            console.error('Error sending test:', error);
        }
    };

    const handleCompSubmit = async (e) => {
        e.preventDefault();

        try {
            await TestService.sendCompTest({
                userId: formData.userId,
                testId: formData.selectedTest.id,
                recipientEmail: formData.recipientEmail,
                recipientName: formData.recipientName,
                duration: formData.duration,
            });
        } catch (error) {
            console.error('Error sending competency test:', error);
        }
    };

    const filteredTests = formData.testType === 'comp' ? tests.filter(test => test.test.testType === 'comp') : tests.filter(test => test.test.testType !== 'comp');

    return (
        <div className={styles.container}>
            <h2>Отправить тест</h2>
            <form className={styles.form} onSubmit={formData.testType === 'comp' ? handleCompSubmit : handleSubmit}>
                <div className={styles.formGroup}>
                    <label>Email получателя:</label>
                    <input type="email" name="recipientEmail" placeholder='ivanov@mail.ru' value={formData.recipientEmail} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                    <label>Имя получателя:</label>
                    <input type="text" name="recipientName" placeholder='Валерий' value={formData.recipientName} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                    <label>Время на прохождение (в минутах):</label>
                    <input type="number" name="duration" value={formData.duration} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                    <label>Выберите тип теста:</label>
                    <select name="testType" value={formData.testType} onChange={handleChange}>
                        <option value="test">Тест</option>
                        <option value="comp">Тест компетенции</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>Выберите тест:</label>
                    <select name="selectedTest" value={formData.selectedTest ? formData.selectedTest.id : ''} onChange={handleTestSelection}>
                        <option value="" disabled>Выберите тест</option>
                        {filteredTests.map((test) => (
                            <option key={test.id} value={test.id}>{test.test.testName}</option>
                        ))}
                    </select>
                </div>
                <button className={styles.submitButton} type="submit" disabled={(!formData.selectedTest || !formData.recipientEmail || !formData.duration)}>Начать тест</button>
            </form>
        </div>
    );
};

export default observer(Send);
