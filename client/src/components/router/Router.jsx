import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './../screens/home/Home';
import Login from './../screens/login/Login';
import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { Layout } from '../ui/Layout';

const Router = () => {
  const { store } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, [store]);

  if (store.isLoading) {
    return <div>Загрузка...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route element={!store.isAuth ? (<Navigate to="/auth/login" replace />) : (<Home />)} index />
        </Route>
        <Route element={store.isAuth ? (<Navigate to="/" replace />) : (<Login />)} path="/auth/login"/>
        <Route path="*" element={store.isAuth ? <Navigate to="/" replace /> : <Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default observer(Router);
