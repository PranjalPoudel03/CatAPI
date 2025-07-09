import './CatCard.css';

const CatCard = ({ cat, onBan }) => {
  return (
    <div className="card">
      <h2>{cat.breedName}</h2>
      <div className="tags">
        <button onClick={() => onBan(cat.breedName)}>{cat.breedName}</button>
        <button onClick={() => onBan(cat.weight)}>{cat.weight} lbs</button>
        <button onClick={() => onBan(cat.origin)}>{cat.origin}</button>
        <button onClick={() => onBan(cat.lifespan)}>{cat.lifespan} years</button>
      </div>
      <img
        src={cat.image}
        alt={cat.breedName}
        className="cat-img"
      />
    </div>
  );
};

export default CatCard;
