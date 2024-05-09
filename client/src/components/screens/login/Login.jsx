import React, { useContext, useState } from 'react'
import styles from './Login.module.css'
import { Context } from '../../../index'
import {observer} from "mobx-react-lite";

import fullLogo from '../../../assets/images/BMWGroupNext_logo.png';

const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const {store} = useContext(Context);

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <form className={styles.form}>
          <img src={fullLogo} alt="Bmw logo" className={styles.logo} />
          <span className={styles.text}>Авторизация</span>
          <div className={styles.inputs}>
            <input
              onChange={e => setEmail(e.target.value)}
              className={styles.input}
              value={email}
              type="text"
              placeholder='Логин'
            />
            <input
              onChange={e => setPassword(e.target.value)}
              className={styles.input}
              value={password}
              type="password"
              placeholder='Пароль'
            />
          </div>
          <input onClick={() => store.login(email, password)} className={styles.btn} type="button" value="Войти" />
        </form>
      </div>
    </div>
  )
}

export default observer(Login)