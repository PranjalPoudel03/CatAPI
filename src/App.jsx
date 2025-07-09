import { useEffect, useState } from 'react';
import './App.css';
import CatCard from './components/CatCard';

const BREEDS_API = 'https://api.thecatapi.com/v1/breeds';

function App() {
  const [breedList, setBreedList] = useState([]);
  const [currentCat, setCurrentCat] = useState(null);
  const [banList, setBanList] = useState([]);

  // Fetch breed list once on mount
  useEffect(() => {
    fetch(BREEDS_API)
      .then((res) => res.json())
      .then((data) => {
        setBreedList(data);
      })
      .catch((err) => console.error('Error fetching breeds', err));
  }, []);

  // Fetch a cat when breeds are loaded
  useEffect(() => {
    if (breedList.length > 0 && !currentCat) {
      fetchRandomCat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breedList]);

  const fetchRandomCat = async () => {
    if (!breedList.length) return;

    let attempts = 0;
    let newBreed = null;

    while (attempts < 10) {
      const randomBreed = breedList[Math.floor(Math.random() * breedList.length)];

      const isBanned =
        banList.includes(randomBreed.name) ||
        banList.includes(randomBreed.weight.metric) ||
        banList.includes(randomBreed.origin) ||
        banList.includes(randomBreed.life_span);

      if (!isBanned) {
        newBreed = randomBreed;
        break;
      }

      attempts++;
    }

    if (!newBreed) {
      setCurrentCat(null);
      return;
    }

    try {
      const imageRes = await fetch(
        `https://api.thecatapi.com/v1/images/search?breed_ids=${newBreed.id}`
      );
      const imageData = await imageRes.json();
      const imageUrl = imageData[0]?.url || newBreed.image?.url;

      const catData = {
        image: imageUrl,
        breedName: newBreed.name,
        weight: newBreed.weight.metric,
        origin: newBreed.origin,
        lifespan: newBreed.life_span,
      };

      setCurrentCat(catData);
    } catch (err) {
      console.error('Failed to fetch image for breed', err);
    }
  };

  const handleBan = (value) => {
    if (!banList.includes(value)) {
      setBanList([...banList, value]);
    }
  };

  const handleUnban = (value) => {
    setBanList(banList.filter((item) => item !== value));
  };

  return (
    <div className="app-container">
      <h1>Veni Vici!</h1>
      <p>Discover cats from your wildest dreams!</p>
      <p>😺😹😻😽😼🙀😿😸😾</p>

      {currentCat ? (
        <CatCard cat={currentCat} onBan={handleBan} />
      ) : (
        <p>No available cats due to bans — try removing some.</p>
      )}

      <button onClick={fetchRandomCat} className="discover-btn">🧭 Discover!</button>

      <div className="ban-list">
        <h3>Ban List</h3>
        <p>Select an attribute in your listing to ban it</p>
        {banList.map((item, index) => (
          <button key={index} onClick={() => handleUnban(item)} className="ban-item">
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
