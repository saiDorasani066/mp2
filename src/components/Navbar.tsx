import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <ul>
        <li id="home-nav">
          <Link to="/">Home</Link>
        </li>
        <li id="explore-nav">
          <Link to="/list-view">List View</Link>
        </li>
        <li id="about-nav">
          <Link to="/gallery-view">Gallery View</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
