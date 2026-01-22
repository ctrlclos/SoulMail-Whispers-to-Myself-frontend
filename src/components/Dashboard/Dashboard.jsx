import { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';

import * as letterService from '../../services/letterService';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const fetchedLetters = await letterService.index();
        setLetters(fetchedLetters);
      } catch (err) {
        console.log(err)
      }
    }
    if (user) fetchLetters();
  }, [user]);

  const handleDelete = async (letterId) => {
    const confirmDelete = window.confirm('Are you sure you are ready to allow this one to rest?');

    if (!confirmDelete) return;

    try{
      await letterService.deleteLetter(letterId);
      setLetters(letters.filter((letter) => letter._id !== letterId));
    } catch (err) {
      console.log(err);
    }
  };
  // Filter letters
  const waitingLetters = letters.filter((letter) => !letter.isDelivered);
  const openedLetters = letters.filter((letter) => letter.isDelivered);

  return (
    <main>
      <h1>SoulMail: Whispers to Myself</h1>
      <p>Leave yourself a whisper</p>

      <h2>Elevated Salutaions, {user.username}</h2>
      <nav>
        <Link to='/'>Home</Link>
        <Link to='/' onClick={() => {
          localStorage.removeItem('token');
          window.location.reload();
        }}>Sign Out</Link>
      </nav>

      <Link to='/letters/new'>Sire your new whisper</Link>
      <section>
        <h3>Waiting to be Opened ({waitingLetters.length})</h3>
        {waitingLetters.length === 0 ? (
          <p>No Letters</p>
        ) : (
          waitingLetters.map((letter) => (
            <div key = {letter._id}>
              <span>{letter.title}</span>
              <span> Delivery Date: {new Date(letter.deliverAt).toLocaleDateString()}</span>
              <Link to={`/letters/${letter._id}/edit`}>Edit Date</Link>
              <button onClick={() => handleDelete(letter._id)}>Delete</button>
            </div>
          ))
        )}
      </section>

      <section>
        <h3>Opened ({openedLetters.length})</h3>
        {openedLetters.length === 0 ? (
          <p> No opened letters yet.</p>
        ) : (
          openedLetters.map((letter) => (
           <div key={letter._id}>
              <span>{letter.title}</span>
              <span> Delivered: {new Date(letter.deliverAt).toLocaleDateString()}</span>
              <Link to={`/letters/${letter._id}/edit`}>View</Link>
              <button onClick={() => handleDelete(letter._id)}>Delete</button>
           </div> 
          ))
        )}
      </section>
    </main>
  );
};

export default Dashboard;
