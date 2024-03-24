import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const sampleData = [
  {
    productName: "Test1",
    description: "This is a test sample",
    price: 100,
    photoName: "",
  },
  {
    productName: "Test2",
    description: "This is a test sample",
    price: 100,
    photoName: "",
  },
  {
    productName: "Test3",
    description: "This is a test sample",
    price: 100,
    photoName: "",
  },
  {
    productName: "Test4",
    description: "This is a test sample",
    price: 100,
    photoName: "",
  },
  {
    productName: "Test5",
    description: "This is a test sample",
    price: 100,
    photoName: "",
  },
];

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
      {showContent ? <SearchContent /> : null}
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

function SearchContent(onClick) {
  const content = sampleData;
  const numSample = content.length;

  return (
    <div className="searchContent">
      {/* <button className="btn" onClick={onClick}>
        Home
      </button> */}
      <h2>Search</h2>

      {numSample > 0 ? (
        <>
          <ul className="samples">
            {content.map((sample) => (
              <Sample sampleObject={sample} key={sample.name} />
            ))}
          </ul>
        </>
      ) : (
        <p>There is no data!</p>
      )}
    </div>
  );
}

//Construct for how a sample is built on the webapp
function Sample({ sampleObject }) {
  return (
    <li>
      <div>
        <h3>{sampleObject.productName}</h3>
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
