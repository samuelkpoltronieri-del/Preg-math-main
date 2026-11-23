import './ThemeCard.css';

export default function ThemeCard({ title, description, onClick }) {
  return (
    <button className="theme-card" type="button" onClick={onClick}>
      <div className="theme-card-title">{title}</div>
      <p>{description}</p>
    </button>
  );
}
