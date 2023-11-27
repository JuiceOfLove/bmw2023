import React from 'react'
import { Link } from 'react-router-dom'

import styles from './AdminPage.module.css'


const AdminPage = () => {

  return (
    <div className={styles.container}>
      <ul className={styles.ul}>
        <li className={styles.link}><Link to='/admin/users' className={styles.item}>Пользователи</Link></li>
        <li className={styles.link}><a className={styles.item}>Пользователи</a></li>
        <li className={styles.link}><a className={styles.item}>Пользователи</a></li>
        <li className={styles.link}><a className={styles.item}>Пользователи</a></li>
      </ul>
    </div>

  )
}

export default AdminPage