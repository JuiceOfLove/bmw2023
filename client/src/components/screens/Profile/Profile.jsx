import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import UserService from './../../../services/UserService';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../index';
import styles from './Profile.module.css';
import uploadIcon from './../../../assets/icons/upload.svg';

const Profile = () => {
    const { store } = useContext(Context);
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                if (store.isAuth) {
                    const userId = store.getCurrentUserId();
                    const response = await UserService.getAvatarUrl(userId);

                    const fullAvatarUrl = `${process.env.REACT_APP_SERVER_URL}${response.avatarUrl}`;

                    setAvatarUrl(fullAvatarUrl);
                }
            } catch (error) {
                console.error('Error fetching avatar:', error);
            }
        };

        fetchAvatar();
    }, [store]);

    const changeAvatar = async (e) => {
        try {
            const newAvatarFile = e.target.files[0];
            const userId = store.getCurrentUserId();
            await UserService.updateAvatarUrl(userId, newAvatarFile);
            const response = await UserService.getAvatarUrl(userId);
            setAvatarUrl(response.avatarUrl);
            window.location.reload();
        } catch (error) {
            console.error('Error updating avatar:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.blocks}>
                <label className={styles.uploadButton}>
                    <img src={avatarUrl} className={styles.avatar} alt="User Avatar" />
                    <input type="file" onChange={changeAvatar} />
                    <img className={styles.uploadIcon} src={uploadIcon} alt="Upload Icon" />
                </label>
                <div className={styles.menu}>
                    <Link to="/settings" className={styles.menuLink}>
                        Сменить пароль
                    </Link>
                    <Link to="/logout" className={styles.menuLink} onClick={() => store.logout()}>
                        Выйти
                    </Link>
                </div>
            </div>

            <div className={styles.userInfo}>
                <span className={styles.item}>Почта: <span className={styles.data}>{store.user.email}</span></span>
                <span className={styles.item}>ФИО: <span className={styles.data}>{store.user.fullName}</span></span>
                <span className={styles.item}>Роль: <span className={styles.data}>{store.user.role}</span></span>
                <span className={styles.item}>Департамент: <span className={styles.data}>{store.user.departament}</span></span>
                <span className={styles.item}>Аккаунт: <span className={styles.data}>{store.user.isActivated === true ? 'Активирован' : 'Неактивирован'}</span></span>
            </div>

        </div>
    );
};

export default observer(Profile);
