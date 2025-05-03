import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const API_KEY = "hackMDからとってね";
  const ENDPOINT = `https://newsapi.org/v2/top-headlines?country=jp&apiKey=${API_KEY}`;
  const onClickButton = () => {
    fetch(ENDPOINT)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
    // alert("警告");
  };

  return (
    <>
      <input type="text" />
      <button onClick={onClickButton}>送信！</button>
    </>
  );
}

export default App;
