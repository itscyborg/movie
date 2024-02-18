import { BrowserRouter, Route, Routes } from "react-router-dom";
import Movie from "./components/Movie";
import MovieDetails from "./components/MovieDetails";
import Season from "./components/Season";


function App() {
  return (
    <BrowserRouter >
      <Routes>
        <Route path="/" element={<Movie />}></Route>
        <Route path="/movie-details/:id" element={<MovieDetails />}></Route>
        <Route path="/title/:id/season/:seasonId" element={<Season />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
