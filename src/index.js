import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import dataset from "./dataSet.json";

// const sampleData = [
//   {
//     productName: "Test1",
//     description: "This is a test sample",
//     price: 100,
//     photoName: "",
//   },
//   {
//     productName: "Test2",
//     description: "This is a test sample",
//     price: 100,
//     photoName: "",
//   },
//   {
//     productName: "Test3",
//     description: "This is a test sample",
//     price: 100,
//     photoName: "",
//   },
//   {
//     productName: "Test4",
//     description: "This is a test sample",
//     price: 100,
//     photoName: "",
//   },
//   {
//     productName: "Test5",
//     description: "This is a test sample",
//     price: 100,
//     photoName: "",
//   },
// ];

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

function Header() {
  const style = {};

  return (
    <header className="header">
      <h1 style={style}>React.js</h1>
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
  const [searchResult, setSearchResult] = useState([]);
  const [loadTime, setLoadTime] = useState(0);

  const handleSearch = () => {
    const startTime = performance.now(); // Record start time

    const filteredContent = content.filter((data) =>
      data.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const endTime = performance.now(); // Record end time
    const measuredLoadTime = endTime - startTime; // Calculate load time
    setLoadTime(measuredLoadTime); // Set load time state

    setSearchResult(filteredContent.slice(0, 100)); // Limit results to 100

    saveData({ searchTerm, loadTime: measuredLoadTime }); // Save data to JSON file
  };

  const saveData = (data) => {
    // Retrieve existing data from localStorage
    const existingData =
      JSON.parse(localStorage.getItem("performanceData")) || [];
    // Append new data to existing data
    const newData = [...existingData, data];
    // Store data in localStorage
    localStorage.setItem("performanceData", JSON.stringify(newData));

    // Create a Blob containing the JSON data
    const blob = new Blob([JSON.stringify(newData, null, 2)], {
      type: "application/json",
    });
    // Create a link element
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    // Set the filename for the downloaded file
    link.download = "search_results.json";
    // Append the link to the body
    document.body.appendChild(link);
    // Simulate a click to initiate download
    link.click();
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  return (
    <div className="searchContent">
      <NavBar
        handleSearch={handleSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <div className="content">
        {searchResult.length > 0 ? (
          <ul className="samples">
            {searchResult.map((data) => (
              <Sample dataset={data} key={data.stockcode} />
            ))}
          </ul>
        ) : (
          <p>No data matching the search term!</p>
        )}
      </div>
      {loadTime > 0 && <p>Load time: {loadTime.toFixed(2)} milliseconds</p>}{" "}
      {/* Display load time */}
    </div>
  );
}

function NavBar({ handleSearch, searchTerm, setSearchTerm }) {
  return (
    <nav className="navbar">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="navbar-btn" onClick={handleSearch}>
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

function Footer() {
  return (
    <footer className="footer">
      <p>This is a sample text</p>
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
