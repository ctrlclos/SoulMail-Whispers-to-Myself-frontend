import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router';

import { UserContext } from '../../contexts/UserContext';
import * as letterService from '../../services/letterService';

const LetterEdit = () => {
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [letter, setLetter] = useState(null);
    const [deliveredAt, setDeliverAt] = useState('');

    useEffect(() => {
        const fetchLetter = async () => {
            try {
              const fetchedLetter = await letterService.show(id);
              setLetter(fetchedLetter);
              const date = new Date(fetchedLetter.deliveredAt).toISOString().split('T')[0];
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
    <main>
      <h1>Edit Deliver Date</h1>   

  <section>
      <h2>{letter.title}</h2>
      <p>{letter.mood}</p>
  </section>

  <form onSubmit={handleSubmit}>
    <label htmlFor='deliveredAt'>New Delivery Date</label>
    <input
        type='date'
        id='deliveredAt'
        value={deliveredAt}
        onChange={(e) => setDeliverAt(e.target.value)}
        min={new Date().toISOString().split('T')[0]}
        required
        />
        <button type='submit'>Update Date</button>
  </form>
      <Link to='/'>Back to Dashboard</Link>
     
    </main>
  );
};
export default LetterEdit;