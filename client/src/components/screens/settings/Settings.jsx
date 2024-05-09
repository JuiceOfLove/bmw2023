import React, { useState, useContext } from 'react';
import UserService from '../../../services/UserService';
import { observer } from "mobx-react-lite";
import { Context } from '../../../index';

const Settings = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const { store } = useContext(Context);

    const handleChangePassword = async () => {
        try {
            const userId = store.getCurrentUserId();
            await UserService.changePassword(userId, oldPassword, newPassword);
            alert('Пароль успешно изменен');
        } catch (error) {
            console.error('Ошибка смены пароля:', error.response?.data?.message);
        }
    };

    return (
        <div>
            <input
                type="password"
                placeholder="Старый пароль"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Новый пароль"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleChangePassword}>Изменить пароль</button>
        </div>
    );
};

export default observer(Settings);
