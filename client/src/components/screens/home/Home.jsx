import React from 'react'
import { Context } from '../../../index';
import { useContext } from 'react';


const Home = () => {

  const { store } = useContext(Context);

  return (
    <div>
      <button onClick={() => store.logout()}>Выйти</button>
    </div>

  )
}

export default Home