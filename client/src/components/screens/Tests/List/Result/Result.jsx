import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Chart from 'chart.js/auto';
import TestService from './../../../../../services/TestService';
import styles from './Result.module.css';

const Result = () => {
    const { id } = useParams();
    const [test, setTest] = useState(null);
    const [type, setType] = useState('');
    const chartRef = useRef(null);

    useEffect(() => {
        if (type === 'comp' && test) {
            renderChart();
        }
    }, [type, test]);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const response = await TestService.getResultById(id);
                setTest(response.data);
                console.log('Тест получен:', response.data);
                if(response.data.test[1].userAverageScore){
                    setType('comp')
                }
            } catch (error) {
                console.error('Ошибка при получении информации о тесте:', error);
            }
        };

        fetchTest();
    }, [id]);

    if (!test) {
        return <div>Loading...</div>;
    }

    const getBackgroundColor = (result) => {
        switch (result) {
            case 'right':
                return styles.correctBackground;
            case 'missed':
                return styles.warningBackground;
            case 'false':
                return styles.errorBackground;
            default:
                return '';
        }
    };

    const renderChart = () => {
        if (chartRef.current) {
            chartRef.current.destroy(); // Уничтожаем предыдущий график
        }

        const ctx = document.getElementById('myChart');
        chartRef.current = new Chart(ctx, {
            type: 'line', // Используем тип line для отображения линейного графика
            data: {
                labels: test.test.map(question => question.groupName), // Используем имена групп в качестве меток по оси Y
                datasets: [
                    {
                        label: 'Пользователь',
                        data: test.test.map(question => ({
                            x: question.userAverageScore,
                            y: question.groupName,
                            pointBackgroundColor: 'blue' // Синие точки для userAverageScore
                        })),
                        borderColor: 'blue', // Цвет линии для userAverageScore
                        backgroundColor: 'blue', // Цвет точек для userAverageScore
                        fill: false // Не заполняем область под линией
                    },
                    {
                        label: 'Рекомендованные',
                        data: test.test.map(question => ({
                            x: question.desiredAverageScore,
                            y: question.groupName,
                            pointBackgroundColor: 'red' // Красные точки для desiredAverageScore
                        })),
                        borderColor: 'red', // Цвет линии для desiredAverageScore
                        backgroundColor: 'red', // Цвет точек для desiredAverageScore
                        fill: false // Не заполняем область под линией
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        min: 0,
                        max: 5
                    },
                    y: {
                        type: 'category',
                        position: 'left'
                    }
                },
                responsive: true, // Разрешить графику быть отзывчивым
                maintainAspectRatio: false // Отключить сохранение пропорций
            }
        });
    };


    if (type === 'comp') {
        return (
            <div className={styles.resultContainer}>
                <h2>Результат тестирования компетенции {test.recipient}</h2>
                <div style={{ width: '450px', height: '400px' }}>
                    <canvas id="myChart"></canvas> {/* Контейнер для графика */}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.resultContainer}>
            <h2>Результат тестирования {test.recipient}</h2>
            <ul>
                {test && test.test && test.test.map((question, index) => (
                    <li key={index}>
                        <p>Вопрос: {question.questionText}</p>
                        <p>Тип: {question.type === 1 ? 'Одиночный выбор' : 'Множественный выбор'}</p>
                        <ul>
                            {question.options.map((option, optionIndex) => (
                                <li key={optionIndex} className={getBackgroundColor(option.result)}>
                                    <input
                                        type={question.type === 1 ? 'radio' : 'checkbox'}
                                        checked={option.selected} // Установлено значение checked на основе option.selected
                                        disabled
                                    />
                                    <label>{option.optionText}</label>
                                    {option.isCorrect && <span className={styles.correct}>Правильный ответ</span>}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Result;
