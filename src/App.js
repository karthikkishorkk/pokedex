import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Details from "./pages/Details/Details";
import Favourites from './pages/Favourites/Favourites';
import Navbar from './components/Navbar/Navbar'


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details/:name" element={<Details />} />
        <Route path="/favourites" element={<Favourites />} />
      </Routes>
    </Router>
  );
};

export default App;
