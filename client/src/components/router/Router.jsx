import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';

import Home from './../screens/home/Home';
import Login from './../screens/login/Login';
import AdminPage from './../screens/adminPage/AdminPage';
import Settings from '../screens/settings/Settings';
import Layout from '../ui/Layout';
import Users from '../screens/adminPage/users/Users';




const Router = () => {
  const { store } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, [store]);

  if (store.isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {store.isAuth ? (
          <>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path='settings' element={<Settings />} />
              <Route path="admin" element={<AdminPage />} />
              <Route path="admin/users" element={<Users/>} />
            </Route>
          </>
        ) : (
          <Route path="/auth/login" element={<Login />} />
        )}
         <Route path="*" element={store.isAuth ? <Navigate to="/" replace /> : <Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default observer(Router);
