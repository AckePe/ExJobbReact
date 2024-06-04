import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import dataset from "./dataSet.json";
import { debounce } from "lodash"; // Import lodash debounce

function generateRandomLetters() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return result;
}

function useSearch() {
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const startTimeRef = useRef(0); // Use ref for mutable value

  const handleSearch = useCallback(
    debounce((content, searchTerm) => {
      setLoading(true);
      startTimeRef.current = performance.now(); // Set start time when search starts

      const filteredContent = content.filter((data) =>
        data.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const slicedContent = filteredContent.slice(0, 500);
      setSearchResult(slicedContent);
      setLoading(false);

      const endTime = performance.now();
      const measuredLoadTime = endTime - startTimeRef.current; // Calculate time taken
      console.log(
        `Search for "${searchTerm}" completed in ${measuredLoadTime} milliseconds`
      );

      return measuredLoadTime;
    }, 300), // Debounce the search function
    []
  );

  return { handleSearch, loading, searchResult };
}

function App() {
  const [showContent, setShowContent] = useState(false);
  const { handleSearch: handleSingleSearch } = useSearch();

  const toggleContent = () => {
    setShowContent((prevShowContent) => !prevShowContent);
  };

  const handleMeasureClick = async () => {
    for (let i = 0; i < 1000; i++) {
      const searchTerm = generateRandomLetters();
      await new Promise((resolve) => setTimeout(resolve, 500)); // Delay to prevent crashes
      handleSingleSearch(dataset, searchTerm);
    }
  };

  return (
    <div className="container">
      <Header />
      <Logo />
      <Button
        onClick={toggleContent}
        buttonText={showContent ? "Home" : "Search"}
      />
      {showContent ? <SearchContent content={dataset} /> : null}
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <h1>React.js</h1>
    </header>
  );
}

function Logo() {
  return (
    <div>
      <img src="/logo192.png" alt="Logo"></img>
    </div>
  );
}

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
  const { handleSearch, loading, searchResult } = useSearch();

  const handleSearchButtonClick = () => {
    handleSearch(content, searchTerm);
  };

  return (
    <div className="searchContent">
      <NavBar
        handleSearchButtonClick={handleSearchButtonClick}
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

function NavBar({ handleSearchButtonClick, searchTerm, setSearchTerm }) {
  return (
    <nav className="navbar">
      <input
        className="search-field"
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        id="navbar-search"
        className="navbar-btn"
        onClick={handleSearchButtonClick}
      >
        Search
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

reportWebVitals();
