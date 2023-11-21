import {Link, Outlet} from 'react-router-dom'
import styles from './Layout.module.css'
import { Context } from '../../index';
import { useContext } from 'react';
import {observer} from "mobx-react-lite";

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
                            <li><a className={styles.nav__link} >Tests</a></li>
                            <li><a className={styles.nav__link} >Patterns</a></li>
                            <li><a className={styles.nav__link} >News</a></li>
                            <li><a className={styles.nav__link} >Settings</a></li>
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