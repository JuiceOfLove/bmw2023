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
        <div>
            <h2>Список результатов</h2>
            <div>
                <button onClick={() => handleFilter('all')}>Все</button>
                <button onClick={() => handleFilter('type1')}>Тип 1</button>
                <button onClick={() => handleFilter('type2')}>Тип 2</button>
            </div>
            <ul>
                {filterResultsByType(resultType).map((result, index) => (
                    <li key={index} className={styles.resultItem}>
                        <p>Отправитель: {getUserName(result.userId)}</p>
                        <p>Получатель: {result.recipient}</p>
                        <p>Название теста: {getTestTitle(result.testId)}</p>
                        <Link to={`/tests/list/${result.id}`} className={styles.resultLink}>Подробнее</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default List;
