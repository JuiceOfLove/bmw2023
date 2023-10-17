import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './../screens/home/Home'
import Login from './../screens/login/Login'

const Router = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route element={<Home />} path='/' />
            <Route element={<Login />} path='/auth/login' />
            <Route path='*' element={<div>Not found</div>} />
        </Routes>
    </BrowserRouter>

  )
}

export default Router