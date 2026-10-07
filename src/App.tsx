import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import DetailView from "./components/DetailView";
import GalleryView from "./components/GalleryView";
import ListView from "./components/ListView";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list-view" element={<ListView />} />
        <Route path="/gallery-view" element={<GalleryView />} />
        <Route path="/details/:artist/:album" element={<DetailView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
