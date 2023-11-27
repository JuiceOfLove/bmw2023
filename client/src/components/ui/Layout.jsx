import {Link, Outlet} from 'react-router-dom'
import { Context } from '../../index';
import { useContext } from 'react';
import {observer} from "mobx-react-lite";

import styles from './Layout.module.css'

import logo from "../../assets/images/BMWGroupNext_logo.png"
import logout from "../../assets/icons/logout.png"


const Layout = () => {

    const { store } = useContext(Context);


    return (
        <div>
            <header className={styles.header}>
                <div className={styles.container}>
                    <img src={logo} alt="BMW logo" />
                    <nav className={styles.nav}>
                        <ul className={styles.ul}>
                            <li><Link to='/' className={styles.nav__link}>Home</Link></li>
                            {/* <li><a className={styles.nav__link} >Tests</a></li> */}
                            {/* <li><a className={styles.nav__link} >Patterns</a></li> */}
                            {/* <li><a className={styles.nav__link} >News</a></li> */}
                            <li><Link to='/settings' className={styles.nav__link} >Settings</Link></li>
                            {store.isAuth && store.user.role === 'admin' && (<li><Link to='/admin' className={styles.nav__link}>Admin</Link></li>)}
                            <li><img src={logout} onClick={() => store.logout()} className={styles.logout} alt='logout icon' /></li>
                        </ul>
                    </nav>
                </div>
            </header>
            <main className={styles.container}><Outlet/></main>
        </div>
    )
}

export default observer(Layout)