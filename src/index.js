import React, { useState, useEffect, Profiler } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import dataset from "./dataSet.json";

// Function to generate random letters
function generateRandomLetters() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return result;
}

function useSearchTiming(letter, isMeasureClicked, searchResult) {
  useEffect(() => {
    console.log(
      "useSearchTiming hook triggered",
      letter,
      isMeasureClicked,
      searchResult
    );

    let startTime;
    if (isMeasureClicked && searchResult.length > 0) {
      startTime = performance.now();
    }

    return () => {
      if (startTime) {
        const endTime = performance.now();
        const measuredLoadTime = endTime - startTime;

        // Log the search operation
        console.log(
          `Search for "${letter}" completed in ${measuredLoadTime} milliseconds`
        );
      }
    };
  }, [letter, isMeasureClicked, searchResult]);
}

function useSearch() {
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [startTime, setStartTime] = useState(0); // New state to store start time

  const handleSearch = (content, searchTerm) => {
    setLoading(true);
    setStartTime(performance.now()); // Set start time when search starts

    const filteredContent = content.filter((data) =>
      data.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const slicedContent = filteredContent.slice(0, 100); // Slice to first 100 items

    setSearchResult(slicedContent);

    setLoading(false);

    const endTime = performance.now();
    const measuredLoadTime = endTime - startTime; // Calculate time taken
    console.log(
      `Search for "${searchTerm}" completed in ${measuredLoadTime} milliseconds`
    ); // Log time taken

    return measuredLoadTime;
  };

  return { handleSearch, loading, searchResult };
}

function App() {
  const [showContent, setShowContent] = useState(false);

  const toggleContent = () => {
    setShowContent((prevShowContent) => !prevShowContent);
  };

  const handleMeasureClick = () => {
    for (let i = 0; i < 1000; i++) {
      const searchTerm = generateRandomLetters();
      handleSingleSearch(searchTerm);
    }
  };

  const { handleSearch: handleSingleSearch } = useSearch();

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
      <button onClick={handleMeasureClick}>Measure 1000 Searches</button>
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

function SearchContent({ content }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMeasureClicked, setIsMeasureClicked] = useState(false);
  const { handleSearch, loading, searchResult } = useSearch();

  useSearchTiming(searchTerm, isMeasureClicked, searchResult);

  const handleSearchButtonClick = () => {
    handleSearch(content, searchTerm);
    setIsMeasureClicked(true);
  };

  const handleSingleSearchClick = () => {
    handleSearch(content, searchTerm);
  };

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
