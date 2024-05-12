import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TestService from '../../../../services/TestService';
import UserService from '../../../../services/UserService';
import styles from './List.module.css';

const List = () => {
    const [results, setResults] = useState([]);
    const [users, setUsers] = useState({});
    const [tests, setTests] = useState({});
    const [resultType, setResultType] = useState('all');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await TestService.getAllResults();
                setResults(response.data);
            } catch (error) {
                console.error('Ошибка при получении списка результатов:', error);
            }
        };

        fetchResults();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await UserService.fetchUsers();
                const usersMap = {};
                response.data.forEach(user => {
                    usersMap[user.id] = user;
                });
                setUsers(usersMap);
            } catch (error) {
                console.error('Ошибка при получении списка пользователей:', error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await TestService.getAllTests();
                const testsMap = {};
                response.data.forEach(test => {
                    testsMap[test.id] = test;
                });
                setTests(testsMap);
            } catch (error) {
                console.error('Ошибка при получении списка тестов:', error);
            }
        };

        fetchTests();
    }, []);

    const getUserName = userId => {
        if (users[userId]) {
            return users[userId].fullName;
        }
        return 'Unknown';
    };

    const getTestTitle = testId => {
        if (tests[testId]) {
            return tests[testId].test.testName;
        }
        return 'Unknown';
    };

    const filterResultsByType = type => {
        switch (type) {
            case 'type1':
                return results
                    .map(result => {
                        if (result.test && !result.test[1].userAverageScore) {
                            return result;
                        }
                        return null;
                    })
                    .filter(result => result !== null);
            case 'type2':
                return results
                    .map(result => {
                        if (result.test && result.test[1].userAverageScore) {
                            return result;
                        }
                        return null;
                    })
                    .filter(result => result !== null);

            default:
                return results;
        }
    };

    const handleFilter = type => {
        setResultType(type);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Список результатов</h2>
            <div className={styles.filterButtons}>
                <button
                    className={`${styles.filterButton} ${resultType === 'all' && styles.active}`}
                    onClick={() => handleFilter('all')}
                >
                    Все
                </button>
                <button
                    className={`${styles.filterButton} ${resultType === 'type1' && styles.active}`}
                    onClick={() => handleFilter('type1')}
                >
                    Тесты
                </button>
                <button
                    className={`${styles.filterButton} ${resultType === 'type2' && styles.active}`}
                    onClick={() => handleFilter('type2')}
                >
                    Компетенции
                </button>
            </div>
            <ul className={styles.resultsList}>
                {filterResultsByType(resultType).map((result, index) => (
                    <li key={index} className={styles.resultItem}>
                        <div>
                            <p>Отправитель:</p>
                            <span>{getUserName(result.userId)}</span>
                        </div>
                        <div>
                            <p>Получатель:</p>
                            <span>{result.recipient}</span>
                        </div>
                        <div>
                            <p>Название теста:</p>
                            <span>{getTestTitle(result.testId)}</span>
                        </div>
                        <Link to={`/tests/list/${result.id}`} className={styles.resultLink}>
                            Подробнее
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default List;
