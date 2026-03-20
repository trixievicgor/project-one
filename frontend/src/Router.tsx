import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage.tsx';
import { IndividualPage } from './pages/IndividualPage.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';

const Router = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<ProtectedRoute auth><LandingPage /></ProtectedRoute>} />
        <Route path='/:symbol' element={<ProtectedRoute auth><IndividualPage /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default Router;
