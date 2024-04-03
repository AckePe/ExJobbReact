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

  const handleSearch = () => {
    const filteredContent = content.filter((data) =>
      data.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResult(filteredContent.slice(0, 100)); // Limit results to 100
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
