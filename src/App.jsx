import { useContext } from 'react';
import { Routes, Route } from 'react-router';
import './App.css';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';

import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import CreateLetter from './components/CreateLetter/CreateLetter';
import LetterEdit from './components/LetterEdit/LetterEdit';
import LetterDetails from './components/LetterDetails/LetterDetails';
import ReflectionPage from './components/ReflectionPage/ReflectionPage';

import { UserContext } from './contexts/UserContext';


const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <Routes>
        
        <Route path='/' element={user ? <Dashboard /> : <Landing /> } />
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
        
        {/* 2. Protected Routes */}
        <Route path="/letters/new" element={user ? <CreateLetter /> : <Landing />} />
        <Route path="/letters/:id/edit" element={user ? <LetterEdit /> : <Landing />} />
        <Route path="/letters/:id" element={user ? <LetterDetails /> : <Landing />} />
        
        <Route path="/letters/:id/reflection" element={user ? <ReflectionPage /> : <Landing />} />
      </Routes>
    </>
  );
};

export default App;