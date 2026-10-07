import { Link } from "react-router-dom";

function Home() {
  return (
    // Caracoule slide 1
    <div className="page-style home">
      <section>
        <h1>Search For Your Favorite Music</h1>
        <p>All in one place, now and old.</p>
        <div className="home-button">
          <Link className="list-button" to={"/list-view"}>
            Music In List View
          </Link>
          <Link className="gallery-button" to={"/gallery-view"}>
            Music In Gallery View
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
