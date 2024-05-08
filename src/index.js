import React, { useState, useEffect, Profiler } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import dataset from "./dataSet.json";
import seedrandom from "seedrandom";

function App() {
  const [showContent, setShowContent] = useState(false);

  const toggleContent = () => {
    setShowContent((prevShowContent) => !prevShowContent);
  };

  return (
    <div className="container">
      <Header />
      <Logo />
      <Button
        onClick={toggleContent}
        buttonText={showContent ? "Home" : "Search"}
      />
      {showContent ? (
        <Profiler id="searchContent" onRender={onRenderCallback}>
          <SearchContent content={dataset} />
        </Profiler>
      ) : null}
      <Footer />
    </div>
  );
}

// Header
function Header() {
  const style = {};

  return (
    <header className="header">
      <h1 style={style}>React.js</h1>
    </header>
  );
}

// React logo
function Logo() {
  return (
    <div>
      <img src="/logo192.png" alt="Logo"></img>
    </div>
  );
}

// Home/To search button
function Button({ onClick, buttonText }) {
  return (
    <div>
      <button className="btn" onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );
}

function dispatchAllRenderCompleteEvent() {
  const allRenderCompleteEvent = new Event("allRenderComplete");
  document.dispatchEvent(allRenderCompleteEvent);
}

// The search and performance handler
function SearchContent({ content }) {
  const [searchResult, setSearchResult] = useState([]);
  const [totalLoadTime, setTotalLoadTime] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMeasureClicked, setIsMeasureClicked] = useState(false);
  const [seed, setSeed] = useState(""); // Initialize seed as empty string

  useEffect(() => {
    // Generate a seed when the component mounts
    setSeed(new Date().getTime().toString());
  }, []);

  useEffect(() => {
    dispatchAllRenderCompleteEvent();
  }, []);

  const handleSearch = (letter) => {
    const startTime = performance.now();

    setLoading(true);

    const filteredContent = content.filter((data) =>
      data.description.toLowerCase().includes(letter.toLowerCase())
    );

    const endTime = performance.now();
    const measuredLoadTime = endTime - startTime;

    setSearchResult(filteredContent);

    const searchItem = { searchTerm: letter, loadTime: measuredLoadTime };
    setSearchData((prevData) => [...prevData, searchItem]);

    setLoading(false);

    // Log the search operation
    console.log(
      `Search for "${letter}" completed in ${measuredLoadTime} milliseconds`
    );

    return measuredLoadTime;
  };

  const runSearches = () => {
    setLoading(true);
    setIsMeasureClicked(true);

    let totalLoadTime = 0;

    // Use the same seed for all searches within a run
    const rng = seedrandom(seed);

    for (let i = 0; i < 1000; i++) {
      const searchTerm = generateRandomSearchTerm(rng);
      totalLoadTime += handleSearch(searchTerm);
    }

    setTotalLoadTime(totalLoadTime);
    setLoading(false);
  };

  const generateRandomSearchTerm = (rng) => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let searchTerm = "";

    for (let i = 0; i < 5; i++) {
      const randomLetterIndex = Math.floor(rng() * alphabet.length);
      const randomLetter = alphabet[randomLetterIndex];
      searchTerm += randomLetter;
    }

    return searchTerm;
  };

  const handleSearchButtonClick = () => {
    runSearches();
  };

  const handleSingleSearchClick = () => {
    handleSearch(searchTerm);
  };

  useEffect(() => {
    const saveData = () => {
      if (isMeasureClicked && searchData.length > 0) {
        const blob = new Blob([JSON.stringify(searchData, null, 2)], {
          type: "application/json",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "search_results.json";
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }
    };

    saveData();
  }, [searchData, isMeasureClicked]);

  return (
    <div className="searchContent">
      <NavBar
        handleSearchButtonClick={handleSearchButtonClick}
        handleSingleSearchClick={handleSingleSearchClick}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <div className="content">
        {loading ? (
          <p>Loading...</p>
        ) : searchResult.length > 0 ? (
          <ul className="samples">
            {searchResult.map((data, index) => (
              <Sample dataset={data} key={index} />
            ))}
          </ul>
        ) : (
          <p>No data matching the search term!</p>
        )}
      </div>
      {totalLoadTime > 0 && (
        <p>
          Total Load time for 1000 searches: {totalLoadTime.toFixed(2)}{" "}
          milliseconds
        </p>
      )}
    </div>
  );
}

function NavBar({
  handleSearchButtonClick,
  handleSingleSearchClick,
  searchTerm,
  setSearchTerm,
}) {
  return (
    <nav className="navbar">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        id="navbar-search"
        className="navbar-btn"
        onClick={handleSingleSearchClick}
      >
        Search
      </button>
      <button className="navbar-btn" onClick={handleSearchButtonClick}>
        Measure
      </button>
    </nav>
  );
}

function Sample({ dataset }) {
  return (
    <li className="card">
      <div className="card-header">
        <h3>Stock code: {dataset.stockcode}</h3>
      </div>
      <div className="card-content">
        <p>
          <strong>Description: {dataset.description}</strong>
        </p>
        <p>
          <strong>Quantity: {dataset.quantity}</strong>
        </p>
        <p>
          <strong>Price: {dataset.price}</strong>
        </p>
        <p>
          <strong>Invoice date: {dataset.invoiceDate}</strong>
        </p>
        <p>
          <strong>Country: {dataset.country}</strong>
        </p>
      </div>
    </li>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>
        <a href="https://creativecommons.org/licenses/by/4.0/">
          Attribution 4.0 International (CC BY 4.0)
        </a>
      </p>
      <p>
        Dataset created by{" "}
        <a href="https://www.kaggle.com/datasets/whenamancodes/online-retail-data-ii">
          Aman Chauhan
        </a>
      </p>
    </footer>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function onRenderCallback(
  id, // Profiler ID
  phase, // "mount" (when the component is mounted) or "update" (when it re-renders)
  actualDuration, // Time spent rendering the committed update
  baseDuration, // Estimated time to render the entire subtree without memoization
  startTime, // When React began rendering this update
  commitTime, // When React committed this update
  interactions // Set of "interactions" that were being traced when this update was scheduled
) {
  // Your performance measurement logic goes here
}
reportWebVitals();
