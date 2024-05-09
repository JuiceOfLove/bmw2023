import { Link, Outlet } from 'react-router-dom';
import { Context } from '../../index';
import { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import styles from './Layout.module.css';

import logo from '../../assets/images/BMWGroupNext_logo.png';
import UserService from '../../services/UserService';

const Layout = () => {
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

    return (
        <div>
            <header className={styles.header}>
                <div className={styles.container}>
                    <img src={logo} className={styles.logo} alt="BMW logo" />
                    <nav className={styles.nav}>
                        <ul className={styles.ul}>
                            <li><Link to='/' className={styles.nav__link}>Главная</Link></li>
                            <li><Link to='/tests' className={styles.nav__link}>Тесты</Link></li>
                            <li><Link to='/patterns' className={styles.nav__link}>Шаблоны</Link></li>
                            {/* <li><a className={styles.nav__link} >News</a></li> */}
                            {store.isAuth && store.user.role === 'admin' && (<li><Link to='/admin' className={styles.nav__link}>Admin</Link></li>)}
                            <li><Link to='/profile' className={styles.nav__link}><div className={styles.avatarContainer}><img src={avatarUrl} alt="User Avatar" className={styles.avatarImage} /></div></Link></li>
                        </ul>
                    </nav>
                </div>
            </header>
            <main className={styles.container}><Outlet/></main>
        </div>
    )
}

export default observer(Layout)