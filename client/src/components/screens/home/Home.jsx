import React from 'react'
import styles from './Home.module.css'

import photo from '../../../assets/images/mainPage.png';


const Home = () => {

  return (
    <div className={styles.container}>
      <h1 className={styles.visuallyHidden}>Заголовок</h1>
      <span className={styles.pageName}>Главная</span>
      <div className={styles.columns}>
        <div className={styles.first}>
          <p className={styles.text}>
            Здесь Вы найдете каталог тестов, которые помогут просто и эффективно оценить компетенции соискателей.</p>
        </div>
        <div className={styles.second}>
          <img src={photo} alt="BMW car" className={styles.image} />
          <button className={styles.btn}>Инструкция</button>
        </div>
      </div>
    </div>

  )
}

export default Home