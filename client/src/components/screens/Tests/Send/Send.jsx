import React, { useState, useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../../index';
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
        <div>
            <h2>Отправить тест</h2>
            <form onSubmit={formData.testType === 'comp' ? handleCompSubmit : handleSubmit}>
                <label>
                    Email получателя:
                    <input type="email" name="recipientEmail" value={formData.recipientEmail} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Имя получателя:
                    <input type="text" name="recipientName" value={formData.recipientName} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Время на прохождение (в минутах):
                    <input type="number" name="duration" value={formData.duration} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Выберите тип теста:
                    <select name="testType" value={formData.testType} onChange={handleChange}>
                        <option value="test">Тест</option>
                        <option value="comp">Тест компетенции</option>
                    </select>
                </label>
                <br />
                <label>
                    Выберите тест:
                    <select name="selectedTest" value={formData.selectedTest ? formData.selectedTest.id : ''} onChange={handleTestSelection}>
                        <option value="" disabled>
                            Выберите тест
                        </option>
                        {filteredTests.map((test) => (
                            <option key={test.id} value={test.id}>
                                {test.test.testName}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <button type="submit" disabled={!formData.selectedTest}>
                    Начать тест
                </button>
            </form>
        </div>
    );
};

export default observer(Send);
