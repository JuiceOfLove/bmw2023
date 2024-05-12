import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Tests.module.css'

const Tests = () => {
  return (
    <div className={styles.container}>
      <ul className={styles.ul}>
        <li className={styles.link}><Link to="/tests/create" className={styles.item}>Создать тест</Link></li>
        <li className={styles.link}><Link to="/tests/compc" className={styles.item}>Создать тест комп.</Link></li>
        <li className={styles.link}><Link to="/tests/send" className={styles.item}>Отправить тест</Link></li>
        <li className={styles.link}><Link to="/tests/list" className={styles.item}>Результаты</Link></li>
      </ul>
    </div>
  )
}

export default Tests




