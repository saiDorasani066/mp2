import axios from "axios";
import { useEffect, useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";

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
  releasedate: string;
  "@attr"?: {
    rank: string;
  };
  tags: {
    tag: {
      name: string;
      url: string;
    }[];
  };
  listeners: string;
  playcount: string;
};

function ListView() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<LastFmResults[]>([]); // or the full list
  const [filter, setFilter] = useState("all");
  const [property, setProperties] = useState("sort-name");
  const [sort, setSort] = useState("ascend");

  // remove duplicates
  const uniqueResults = results.filter((result, index, array) => {
    return (
      result.mbid !== "" &&
      index ===
        array.findIndex(
          (item) =>
            item.name === result.name &&
            item.artist.name === result.artist.name,
        )
    );
  });

  const filterResults = uniqueResults.filter((result) => {
    if (filter == "all") {
      return true;
    }
    if (filter == "name") {
      return result.name.toLowerCase().includes(search.toLowerCase());
    }
    if (filter == "artist") {
      return result.artist.name.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });
  // Make a copy of results and change that
  const sortResults = [...filterResults].sort((a, b) => {
    if (property == "sort-artist") {
      if (sort == "ascend") {
        return a.artist.name.localeCompare(b.artist.name);
      }

      if (sort == "decend") {
        return b.artist.name.localeCompare(a.artist.name);
      }
    }

    if (property == "sort-name") {
      if (sort == "ascend") {
        return a.name.localeCompare(b.name);
      }
      if (sort == "decend") {
        return b.name.localeCompare(a.name);
      }
    }

    return 0;
  });

  useEffect(() => {
    if (search == "") {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      const params = {
        method: "album.search",
        album: search,
        api_key: import.meta.env.VITE_LASTFM_API_KEY,
        format: "json",
        limit: 10,
      };

      axios
        .get("https://ws.audioscrobbler.com/2.0/", {
          params: params,
        })
        .then((response) => {
          const newResults = response.data.results.albummatches.album.map(
            (result: any) => ({
              ...result,
              artist: {
                name: result.artist,
              },
            }),
          );

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
  }, [search]);

  return (
    <div className="page-style list-view">
      <h1>List View</h1>
      <div className="list-input">
        <div>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search For Music"
          ></input>
        </div>
        <div className="list-filter-options">
          <div className="filter-column">
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">All</option>
              <option value="name">Name</option>
              <option value="artist">Artist</option>
            </select>
          </div>
          <div className="filter-column">
            <select
              value={property}
              onChange={(event) => setProperties(event.target.value)}
            >
              <option value="sort-artist">Sort by Artist</option>
              <option value="sort-name">Sort by Name</option>
            </select>
          </div>
          <div className="filter-column">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="ascend">Assending</option>
              <option value="decend">Decending</option>
            </select>
          </div>
        </div>
      </div>
      <div className="list-cards">
        {sortResults.map((result, index) => {
          const artist = result.artist;
          const title = result.name;
          return (
            <Link
              to={`/details/${encodeURIComponent(result.artist.name)}/${encodeURIComponent(result.name)}`}
              key={`${result.artist}-${result.name}-${index}`}
              state={{
                results: sortResults,
              }}
              className="list-card-link"
            >
              <div key={result.mbid} className="card list-card">
                {result.image[2]?.["#text"] ? (
                  <img
                    src={result.image[2]["#text"]}
                    alt={result.name}
                    className="card-image"
                  />
                ) : (
                  <p>Couldn't Find An Image.</p>
                )}
                <div className="list-card-info">
                  <h1>{title}</h1>
                  <h3>{artist.name}</h3>
                  <p>{result["@attr"]?.rank}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default ListView;
