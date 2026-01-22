import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';

// Import the UserContext object
import { UserContext } from '../../contexts/UserContext';

const NavBar = () => {
  // Get the setUser function from the UserContext
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Add the handleSignOut function
  const handleSignOut = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    // Clear the user state
    setUser(null);
    // Navigate to home
    navigate('/');
  };

  return (
    <nav className="image-button-nav">
      {user ? (
        <div className="nav-buttons">
          {/* Dashboard button */}
          <Link to='/' className="nav-image-btn">
            <img 
              src="/images/buttons/your_dashboard_but.png" 
              alt="Dashboard"
              className="btn-default"
            />
            <img 
              src="/images/buttons/your_dashboard_but2.png" 
              alt="Dashboard"
              className="btn-hover"
            />
          </Link>
          
          {/* New letter button */}
          <Link to='/letters/new' className="nav-image-btn">
            <img 
              src="/images/buttons/create_but.png" 
              alt="Create Letter"
              className="btn-default"
            />
            <img 
              src="/images/buttons/create_but2.png" 
              alt="Create Letter"
              className="btn-hover"
            />
          </Link>
          
          {/* Sign out button */}
          <button onClick={handleSignOut} className="nav-image-btn">
            <img 
              src="/images/buttons/sign_out_but.png" 
              alt="Sign Out"
              className="btn-default"
            />
            <img 
              src="/images/buttons/sign_out_but2.png" 
              alt="Sign Out"
              className="btn-hover"
            />
          </button>
        </div>
      ) : (
        <ul>
          {/* Home link */}
          <li><Link to='/'>Home</Link></li>
          {/* Sign in link */}
          <li><Link to='/sign-in'>Sign In</Link></li>
          {/* Sign up link */}
          <li><Link to='/sign-up'>Sign Up</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;