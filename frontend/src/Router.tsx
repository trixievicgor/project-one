import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';

const Router = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<ProtectedRoute auth><LandingPage /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default Router;
