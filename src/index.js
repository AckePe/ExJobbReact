import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import dataset from "./dataSet.json";

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
      {showContent ? <SearchContent content={dataset} /> : null}
      <Footer />
    </div>
  );
}

//Header
function Header() {
  const style = {};

  return (
    <header className="header">
      <h1 style={style}>React.js</h1>
    </header>
  );
}

//React logo
function Logo() {
  return (
    <div>
      <img src="/logo192.png" alt="Logo"></img>
    </div>
  );
}

//Home/To search button
function Button({ onClick, buttonText }) {
  return (
    <div>
      <button className="btn" onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );
}

//The search and performance handler
function SearchContent({ content }) {
  const [searchResult, setSearchResult] = useState([]);
  const [totalLoadTime, setTotalLoadTime] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // Define searchTerm state
  const [searchData, setSearchData] = useState([]); // Define searchData state

  const handleSearch = (letter) => {
    const startTime = performance.now(); // Record start time

    const filteredContent = content.filter((data) =>
      data.description.toLowerCase().includes(letter.toLowerCase())
    );

    const endTime = performance.now(); // Record end time
    const measuredLoadTime = endTime - startTime; // Calculate load time

    setSearchResult(filteredContent.slice(0, 100)); // Limit results to 100

    const searchItem = { searchTerm: letter, loadTime: measuredLoadTime };
    setSearchData((prevData) => [...prevData, searchItem]); // Store search data

    return measuredLoadTime; // Return load time
  };

  const runSearches = () => {
    let totalLoadTime = 0; // Variable to store total load time

    // Run searches until 1000 searches are made
    for (let i = 0; i < 1000; i++) {
      const searchTerm = generateRandomSearchTerm(); // Generate a random search term
      totalLoadTime += handleSearch(searchTerm); // Add load time of current search to total
    }

    setTotalLoadTime(totalLoadTime); // Set total load time
  };

  // Function to generate a random search term
  const generateRandomSearchTerm = () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let searchTerm = "";

    for (let i = 0; i < 5; i++) {
      // Generate a search term of length 5
      const randomLetterIndex = Math.floor(Math.random() * alphabet.length);
      const randomLetter = alphabet[randomLetterIndex];
      searchTerm += randomLetter;
    }

    return searchTerm;
  };

  const handleSearchButtonClick = () => {
    setSearchData([]); // Clear previous search data
    runSearches(); // Run 1000 searches
  };

  useEffect(() => {
    const saveData = () => {
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
    };

    if (searchData.length > 0) {
      saveData(); // Save data when searchData is updated
    }
  }, [searchData]);

  return (
    <div className="searchContent">
      <NavBar
        handleSearchButtonClick={handleSearchButtonClick}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm} // Pass setSearchTerm to NavBar
      />
      <div className="content">
        {searchResult.length > 0 ? (
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
      {/* Display total load time */}
    </div>
  );
}

function NavBar({ handleSearchButtonClick, searchTerm, setSearchTerm }) {
  return (
    <nav className="navbar">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="navbar-btn" onClick={handleSearchButtonClick}>
        Search
      </button>
    </nav>
  );
}

// Construct for how a sample is built on the webapp
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

//Copyright license
function Footer() {
  return (
    <footer className="footer">
      <p>
        <a href="https://creativecommons.org/licenses/by/4.0/">
          Attribution 4.0 International (CC BY 4.0)
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
