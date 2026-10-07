import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

type LastFmResults = {
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
  "@attr"?: {
    rank: string;
  };
};

function GalleryView() {
  const [results, setResults] = useState<LastFmResults[]>([]); // or the full list
  const [filter, setFilter] = useState("all");

  // remove duplicates
  const uniqueResults = results.filter((result, index, array) => {
    return (
      index ===
      array.findIndex(
        (item) =>
          item.name === result.name && item.artist.name === result.artist.name,
      )
    );
  });

  useEffect(() => {
    if (filter == "") {
      return;
    }
    const timer = setTimeout(() => {
      let params = {};

      if (filter == "all") {
        params = {
          method: "tag.gettopalbums",
          tag: "music",
          api_key: import.meta.env.VITE_LASTFM_API_KEY,
          format: "json",
        };
      } else {
        params = {
          method: "tag.gettopalbums",
          tag: filter,
          api_key: import.meta.env.VITE_LASTFM_API_KEY,
          format: "json",
        };
      }
      axios
        .get("https://ws.audioscrobbler.com/2.0/", {
          params: params,
        })
        .then((response) => {
          let newResults = [];

          // if filter all find all or else find only what is requested
          if (filter == "all") {
            newResults = response.data.albums.album;
          } else {
            newResults = response.data.albums.album;
          }

          // console.log(newResults);

          setResults(newResults);
        })

        .catch((error) => {
          console.log("Last.fm request failed:", error);
        });
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [filter]);

  return (
    <div className="page-style gallery-view">
      <h1>Gallery View</h1>
      <div>
        <div className="gallery-categories">
          <button
            onClick={() => {
              setFilter("all");
            }}
          >
            All
          </button>
          <button
            onClick={() => {
              setFilter("Jazz");
            }}
          >
            Jazz
          </button>
          <button
            onClick={() => {
              setFilter("Pop");
            }}
          >
            Pop
          </button>
          <button
            onClick={() => {
              setFilter("Classical");
            }}
          >
            Classical
          </button>
          <button
            onClick={() => {
              setFilter("Rock");
            }}
          >
            Rock
          </button>
          <button
            onClick={() => {
              setFilter("Electronic");
            }}
          >
            Electronic
          </button>
          <button
            onClick={() => {
              setFilter("Latin");
            }}
          >
            Latin
          </button>
        </div>
        <div className="gallery-cards">
          {uniqueResults.map((result, index) => {
            const artist = result.artist.name;
            const title = result.name;
            return (
              <Link
                to={`/details/${encodeURIComponent(result.artist.name)}/${encodeURIComponent(result.name)}`}
                key={`${result.artist}-${result.name}-${index}`}
                state={{
                  results: uniqueResults,
                  rank: result["@attr"]?.rank,
                }}
              >
                <div className="card">
                  {result.image[2]?.["#text"] ? (
                    <img
                      src={result.image[2]["#text"]}
                      alt={result.name}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <p>Couldn't Find An Image.</p>
                  )}
                  <h2>{title}</h2>
                  <h3>{artist}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GalleryView;
