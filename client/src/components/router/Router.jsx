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
import Tests from '../screens/Tests/Tests';
import Create from '../screens/Tests/Create/Create';
import Profile from '../screens/Profile/Profile';
import Pattern from './../screens/Patterns/Patterns';
import PatternCreate from '../screens/Patterns/Create/PatternCreate';
import Send from '../screens/Tests/Send/Send';
import Pass from '../screens/Tests/Pass/Pass';
import List from '../screens/Tests/List/List';
import NotFound from '../screens/404/NotFound';
import Result from '../screens/Tests/List/Result/Result';
import Comp from '../screens/Tests/Comp/Comp';


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
         <Route path="pass/:startingLink" element={<Pass />} />
        {store.isAuth ? (
          <>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path='settings' element={<Settings />} />
              <Route path='tests' element={<Tests />} />
              <Route path='tests/create' element={<Create />} />
              <Route path='tests/compc' element={<Comp />} />
              <Route path='tests/send' element={<Send />} />
              <Route path="tests/list" element={<List />} />
              <Route path="tests/list/:id" element={<Result />} />
              <Route path='patterns' element={<Pattern />} />
              <Route path='patterns/create' element={<PatternCreate />} />
              <Route path="admin" element={<AdminPage />} />
              <Route path="admin/users" element={<Users/>} />
              <Route path="profile" element={<Profile/>} />
            </Route>
          </>
        ) : (
          <Route path="/auth/login" element={<Login />} />
        )}
         <Route path="*" element={store.isAuth ? <Navigate to="/" replace /> : <Navigate to="/auth/login" replace />} />
         <Route path="/404" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
};

export default observer(Router);
