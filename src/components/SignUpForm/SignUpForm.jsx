import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { signUp } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';
import NavBar from '../NavBar/NavBar';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConf: '',
  });

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const newUser = await signUp(formData);
      setUser(newUser);
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
        <h2>Sign Up</h2>
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
            <label htmlFor='passwordConf'>Confirm Password:</label>
            <input
              type='password'
              id='passwordConf'
              name='passwordConf'
              value={formData.passwordConf}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <button type="submit">Sign Up</button>
            <button type="button" onClick={() => navigate('/')}>Cancel</button>
          </div>
        </form>

        <div className="signup-link">
          Already have an account? <a onClick={() => navigate('/sign-in')}>Sign in here</a>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;