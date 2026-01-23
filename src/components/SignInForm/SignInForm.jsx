import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import NavBar from '../NavBar/NavBar';

import { signIn } from '../../services/authService';

import { UserContext } from '../../contexts/UserContext';

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      // This function doesn't exist yet, but we'll create it soon.
      // It will cause an error right now
      const signedInUser = await signIn(formData);

      setUser(signedInUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

return (
  <div className="page-container">
    <div className="header">
      <img src="/images/logo.png" alt="SoulMail Logo" className="logo-image" />
      <NavBar />
    </div>
    
    <div className="form-box">
      <h2>Sign In</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      
      <form autoComplete='off' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username'>Username:</label>
          <input
            type='text'
            id='username'
            name='username'
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit">Sign In</button>
          <button type="button" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>

      <div className="signup-link">
        Don't have an account? <a onClick={() => navigate('/sign-up')}>Sign up here</a>
      </div>
    </div>
  </div>
);
};

export default SignInForm;
