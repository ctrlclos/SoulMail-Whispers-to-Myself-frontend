import { useContext } from 'react';
import { Routes, Route } from 'react-router';
import './App.css';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';

import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import CreateLetter from './components/CreateLetter/CreateLetter';
import EditLetter from './components/EditLetter/EditLetter';
import LetterDetails from './components/LetterDetails/LetterDetails';

import { UserContext } from './contexts/UserContext';


const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <Landing /> } />
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/letters/new" element={user ? <CreateLetter /> : <Landing />} />
        <Route path="/letters/:id/edit" element={user ? <EditLetter /> : <Landing />} />
        <Route path="/letters/:id" element={user ? <LetterDetails /> : <Landing />} />
      </Routes>
    </>
  );
};

export default App;