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
  const [homeVisible, setHomeVisible] = useState(true);
  return (
    <div className="container">
      <Header />
      <Logo />
      homeVisible ? (
      <Button />) : (
      <SearchContent />)
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

function Button() {
  return (
    <div>
      <button className="btn">To search!</button>
    </div>
  );
}

function SearchContent() {
  const content = sampleData;
  const numSample = content.length;

  return (
    <div className="searchContent">
      <h2>Search</h2>

      {numSample > 0 ? (
        <>
          <p>Here you can search</p>

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
function Sample({ sampleObject }) {}

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
