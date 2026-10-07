import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

type ReleaseDetails = {
  name: string;
  artist: {
    name: string;
  };
  image: {
    "#text": string;
    size: string;
  }[];
  mbid: string;
  url: string;
  releasedate: string;
  rank: string;
  tags: {
    tag: {
      name: string;
      url: string;
    }[];
  };
  listeners: string;
  playcount: string;
};

function DetailView() {
  const { artist, album } = useParams();
  const [details, setDetails] = useState<ReleaseDetails | null>(null);
  const location = useLocation();

  const rank = location.state?.rank;

  // results and show results even when typed in url
  const results = location.state?.results ?? [];

  const currentIndex = results.findIndex(
    (result: { name: string; artist: { name: string } }) => {
      return result.name == album && result.artist.name == artist;
    },
  );

  const prevIdx = currentIndex - 1;
  const nextIdx = currentIndex + 1;

  const prevResults = results[prevIdx];
  const nextResults = results[nextIdx];

  const year = details?.releasedate?.match(/\d{4}/)?.[0];

  useEffect(() => {
    if (!album || !artist) {
      return;
    }
    axios
      .get(`https://ws.audioscrobbler.com/2.0/`, {
        params: {
          method: "album.getInfo",
          artist: artist,
          album: album,
          api_key: import.meta.env.VITE_LASTFM_API_KEY,
          format: "json",
        },
      })

      .then((response) => {
        // console.log("DETAIL RESPONSE:", response.data.album);
        const albumDetails = {
          ...response.data.album,
          artist: {
            name: response.data.album.artist,
          },
        };
        setDetails(albumDetails);
      });
  }, [artist, album]);
  return (
    // Caracoule slide 2
    <div className="page-style details-view">
      {details && (
        <div className="card detail-card">
          {details.image[2]?.["#text"] ? (
            <img
              src={details.image[2]["#text"]}
              alt={details.name}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
              className="detail-image"
            />
          ) : (
            <p>Couldn't Find An Image.</p>
          )}
          <h2>{details.name}</h2>
          <h2>Artist: {details.artist.name}</h2>
          <p>{year ?? ""}</p>
          <div className="genre-list">
            {details.tags?.tag?.map((tag) => (
              <span className="genre-block" key={tag.name}>
                {tag.name}
              </span>
            ))}
          </div>
          <div className="detail-info">
            {rank && <p>Rank: {rank}</p>}
            <p>Listeners: {details.listeners}</p>
            <p>Playcount: {details.playcount}</p>
          </div>
        </div>
      )}
      <div className="card-controls">
        {prevIdx >= 0 && (
          <Link
            to={`/details/${encodeURIComponent(prevResults.artist.name)}/${encodeURIComponent(prevResults.name)}`}
            state={{
              results: results,
              rank: prevResults["@attr"]?.rank,
            }}
          >
            <button>Prev</button>
          </Link>
        )}
        {nextIdx < results.length && (
          <Link
            to={`/details/${encodeURIComponent(nextResults.artist.name)}/${encodeURIComponent(nextResults.name)}`}
            state={{
              results: results,
              rank: nextResults["@attr"]?.rank,
            }}
          >
            <button>Next</button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default DetailView;
