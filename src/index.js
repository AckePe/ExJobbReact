import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

function App() {
  const [homeVisible, setHomeVisible] = useState(true);
  return (
    <div className="container">
      <Header />
      <Logo />
      homeVisible ? (
      <Button />) : (
      <Search />
      )
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

function Search() {}

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
