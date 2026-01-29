import { useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import './App.css';
import DemoPanel from './components/DemoPanel/DemoPanel'

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';

import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import CreateLetter from './components/CreateLetter/CreateLetter';
import LetterEdit from './components/LetterEdit/LetterEdit';
import ProfileSettings from './components/ProfileSettings/ProfileSettings';
import LetterDetails from './components/LetterDetails/LetterDetails';
import ReflectionPage from './components/ReflectionPage/ReflectionPage';
import AITestPage from './components/AITestPage/AITestPage';

import { UserContext } from './contexts/UserContext';


const App = () => {
  const { user } = useContext(UserContext);
    const location = useLocation();


  return (
    <>
      <Routes>

        <Route path='/' element={user ? <Dashboard key={location.key} /> : <Landing />} />
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />

        {/* 2. Protected Routes */}
        <Route path="/letters/new" element={user ? <CreateLetter /> : <Landing />} />
        <Route path="/letters/:id/edit" element={user ? <LetterEdit /> : <Landing />} />
        <Route path="/settings" element={user ? <ProfileSettings /> : <Landing />} />
        <Route path="/letters/:id" element={user ? <LetterDetails /> : <Landing />} />

        <Route path="/letters/:id/reflection" element={user ? <ReflectionPage /> : <Landing />} />

        {/* Test Page for AI Features */}
        <Route path="/ai-test" element={user ? <AITestPage /> : <Landing />} />
      </Routes>
      
      <DemoPanel />
    </>
  );
};

export default App;