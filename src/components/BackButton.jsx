import { Link } from 'react-router-dom';
import "../styles.css";

function BackButton() {
  return (
    <Link to="/" className="back-button">
      Back
    </Link>
  );
}

export default BackButton;
