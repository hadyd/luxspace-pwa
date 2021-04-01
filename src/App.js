import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Arrived from "./components/Arrived";
import Browse from "./components/Browse";
import Client from "./components/Client";
import Header from "./components/Header";
import Hero from "./components/Hero";
import AsideMenu from "./components/AsideMenu";
import Footer from "./components/Footer";
import Offline from "./components/Offline";
import Splash from "./pages/Splash";
import Profile from "./pages/Profile";

function App() {
  const [items, setItems] = React.useState([]);
  const [offlineStatus, setOfflineStatus] = React.useState(!navigator.onLine);
  const [isLoading, setIsloading] = React.useState(true);

  function handleOfllineStatus() {
    setOfflineStatus(!navigator.onLine);
  }
  React.useEffect(
    function () {
      (async function () {
        const response = await fetch(
          "https://prod-qore-app.qorebase.io/8ySrll0jkMkSJVk/allItems/rows?limit=7&offset=0&$order=asc",
          {
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              "x-api-key": process.env.REACT_APP_APIKEY,
            },
          }
        );
        const { nodes } = await response.json();
        setItems(nodes);

        const script = document.createElement("script");
        script.src = "./carousel.js";
        script.async = false;
        document.body.appendChild(script);
      })();

      handleOfllineStatus();
      window.addEventListener("online", handleOfllineStatus);
      window.addEventListener("offline", handleOfllineStatus);

      setTimeout(function () {
        setIsloading(false);
      }, 1500);

      return function () {
        window.removeEventListener("online", handleOfllineStatus);
        window.removeEventListener("offline", handleOfllineStatus);
      };
    },
    [offlineStatus]
  );

  return (
    <>
      {isLoading === true ? (
        <Splash />
      ) : (
        <>
          {offlineStatus && <Offline />}
          <Header />
          <Hero />
          <Browse />
          <Arrived items={items} />
          <Client />
          <AsideMenu />
          <Footer />
        </>
      )}
    </>
  );
}

export default function Routes() {
  return (
    <Router>
      <Route path="/" exact component = {App} />
      <Route path="/profile" exact component = {Profile} />
    </Router>
  )
};
