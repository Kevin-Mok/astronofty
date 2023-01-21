import "./App.css";
import Navbar from "./components/Navbar.js";
import Marketplace from "./components/Marketplace";
import Profile from "./components/Profile";
import CreateNFT from "./components/CreateNFT";
import NFTPage from "./components/NFTpage";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/createNFT" element={<CreateNFT />} />
          <Route path="/nftPage/:tokenId" element={<NFTPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

// <Routes>
// <Route path="/" element={<Marketplace />} />
// <Route path="/nftPage" element={<NFTPage />} />
// <Route path="/profile" element={<Profile />} />
// <Route path="/sellNFT" element={<SellNFT />} />
// <Route path="/editNFT" element={<EditNFT />} />
// </Routes>
export default App;
