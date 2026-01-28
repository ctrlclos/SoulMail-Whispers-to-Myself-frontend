import { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import NavBar from '../NavBar/NavBar';
import { CelebrationModal } from '../Celebrations';
import { checkCelebrations, getCelebrationMessage, CELEBRATION_TYPES } from '../../utils/celebrationUtils';
import * as letterService from '../../services/letterService';
import * as userService from '../../services/userService';
import { Affirmation } from '../AI';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [letters, setLetters] = useState([]);
  const [showWaiting, setShowWaiting] = useState(true);
  const [showOpened, setShowOpened] = useState(true);
  const [celebration, setCelebration] = useState(null)


  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const fetchedLetters = await letterService.index();
        setLetters(fetchedLetters || []);

        try {
          const profile = await userService.getProfile();
          const celebrations = checkCelebrations(profile, profile.settings);

          const newlyDelivered = (fetchedLetters || []).filter(
            (letter) => letter.isDelivered && !localStorage.getItem(`viewed_${letter._id}`)
          );

          if (newlyDelivered.length > 0 && profile.settings?.letterDeliveredOomph) {
            celebrations.push({
              type: CELEBRATION_TYPES.LETTER_DELIVERED,
              ...getCelebrationMessage('letterDelivered')
            });

            newlyDelivered.forEach(letter => {
              localStorage.setItem(`viewed_${letter._id}`, 'true');
            });
          }

          if (celebrations.length > 0) {
            setCelebration(celebrations[0]);
          }
        } catch (profileErr) {
          console.log('Profile fetch failed, skipping celebrations:', profileErr);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (user) fetchLetters();
  }, [user]);

  const handleCelebrationClose = () => {
    setCelebration(null);
  };

  const handleDelete = async (letterId) => {
    const confirmDelete = window.confirm('Are you sure you are ready to allow this one to rest?');
    if (!confirmDelete) return;

    try {
      await letterService.deleteLetter(letterId);
      setLetters(letters.filter((letter) => letter._id !== letterId));
    } catch (err) {
      console.log(err);
    }
  };

  const waitingLetters = letters.filter((letter) => !letter.isDelivered);
  const openedLetters = letters.filter((letter) => letter.isDelivered);

  return (
    <div className="page-container">
      {celebration && (
        <CelebrationModal
        celebration={celebration}
        onClose={handleCelebrationClose}
        />
      )}
      <div className="header">
        <img src="/images/logo.png" alt="SoulMail Logo" className="logo-image" />
        <NavBar />
      </div>

      <div className="dashboard-wrapper">
        <div className="greeting">
          Elevated Salutations, {user?.username}
        </div>
        <Affirmation className="dashboard-affirmation" loadingText="" />
        <p className="dashboard-tagline">Leave yourself a whisper</p>


        <div className="dashboard-content">
          <div className="dashboard-section">
            <div
              className="section-header"
              onClick={() => setShowWaiting(!showWaiting)}
            >
              <h3>Waiting to be Opened ({waitingLetters.length})</h3>
              <span className="toggle-icon">{showWaiting ? '▼' : '▶'}</span>
            </div>

            {showWaiting && (
              <div className="section-content">
                {waitingLetters.length === 0 ? (
                  <p className="no-letters">No letters waiting</p>
                ) : (
                  waitingLetters.map((letter) => (
                    <div key={letter._id} className="letter-card">
                      <div className="letter-info">
                        <span className="letter-title">{letter.title}</span>
                        <span className="letter-date">
                          Delivery Date: {new Date(letter.deliveredAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="letter-actions">
                        <Link to={`/letters/${letter._id}/edit`} className="action-btn">
                          Edit Date
                        </Link>
                        <button
                          onClick={() => handleDelete(letter._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="dashboard-section">
            <div
              className="section-header"
              onClick={() => setShowOpened(!showOpened)}
            >
              <h3>Already Opened ({openedLetters.length})</h3>
              <span className="toggle-icon">{showOpened ? '▼' : '▶'}</span>
            </div>

            {showOpened && (
              <div className="section-content">
                {openedLetters.length === 0 ? (
                  <p className="no-letters">No opened letters yet</p>
                ) : (
                  openedLetters.map((letter) => (
                    <div key={letter._id} className="letter-card">
                      <div className="letter-info">
                        <span className="letter-title">{letter.title}</span>
                        <span className="letter-date">
                          Delivered: {new Date(letter.deliveredAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="letter-actions">
                        <Link to={`/letters/${letter._id}`} className="action-btn">
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(letter._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;