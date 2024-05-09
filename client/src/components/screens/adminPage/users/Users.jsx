import React, { useState } from 'react';
import AuthService from './../../../../services/AuthService';

const Users = () => {
  const [email, setEmail] = useState('');

  const handleRegister = async () => {
    try {
        const response = await AuthService.registration(email);

        console.log('Пользователь зарегистрирован:', response.data);
    } catch (error) {
        console.error('Ошибка регистрации:', error.response?.data?.message);
    }
};

  return (
    <div>
      <input
        type="text"
        placeholder="Введите почту"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleRegister}>Зарегистрироваться</button>
    </div>
  );
};

export default Users;
