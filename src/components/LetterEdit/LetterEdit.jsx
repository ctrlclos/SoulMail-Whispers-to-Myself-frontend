import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import NavBar from '../NavBar/NavBar';
import * as letterService from '../../services/letterService';

const LetterEdit = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [letter, setLetter] = useState(null);
  const [deliveredAt, setDeliveredAt] = useState('');

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const fetchedLetter = await letterService.show(id);
        setLetter(fetchedLetter);
        const date = new Date(fetchedLetter.deliveredAt).toISOString().split('T')[0];
        setDeliveredAt(date);
      } catch (err) {
        console.log(err);
      }
    };
    if (user) fetchLetter();
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await letterService.update(id, deliveredAt);
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  if (!letter) return <p>Gathering your whispers...</p>;

  return (
    <div className="page-container">
      <div className="header">
        <img src="/images/logo.png" alt="SoulMail Logo" className="logo-image" />
        <NavBar />
      </div>

      <div className="create-letter-wrapper">
        <div className="form-inner-box">
          <h2 className="form-title">Edit Delivery Date</h2>

          <div className="edit-letter-info">
            <h3 className="edit-letter-title">{letter.title}</h3>
            <p className="edit-letter-subtitle">
              Want to receive your letter at a different time? Update the delivery date below and adjust when this whisper returns to you.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="edit-letter-info">
              <div className="form-row">
                <label>
                  New Delivery Date: 
                  <span className="form-note">
                    (Must be at least one week from today)
                  </span>
                </label>
                <input
                  type='date'
                  id='deliveredAt'
                  value={deliveredAt}
                  onChange={(e) => setDeliveredAt(e.target.value)}
                  min={(() => {
                    const date = new Date();
                    date.setDate(date.getDate() + 7);
                    return date.toISOString().split('T')[0];
                  })()}
                  required
                />
              </div>
            </div>

            <button type='submit' className="submit-btn">Update Date</button>

            <div className="cancel-link">
              <a onClick={() => navigate('/')}>Cancel and return to Dashboard</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LetterEdit;