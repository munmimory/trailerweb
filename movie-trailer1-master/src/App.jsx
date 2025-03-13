import { useEffect, useState } from "react";
import Banner from "./components/Banner";
import Header from "./components/Header";
import MovieList from "./components/MovieList";
import MovieSearch from "./components/MovieSearch";
import { MovieProvider } from "./context/MovieDetailContext";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

function App() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [error, setError] = useState(null);

  if (!API_KEY) {
    console.error("❌ Lỗi: API Key không tồn tại! Hãy kiểm tra lại file .env.");
    setError("API Key không tồn tại. Vui lòng kiểm tra file .env.");
  }

  const fetchMovies = async (endpoint) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}&api_key=${API_KEY}`, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}`);
      }
      const data = await response.json();
      console.log(`Dữ liệu từ ${endpoint}:`, data.results);
      return data.results || [];
    } catch (error) {
      console.error(`❌ Lỗi khi gọi API: ${endpoint}`, error);
      setError("Không thể tải dữ liệu phim. Vui lòng kiểm tra khóa API hoặc kết nối mạng.");
      return [];
    }
  };

  const handleSearch = async (value) => {
    if (!value) {
      setSearchData([]);
      return;
    }

    const results = await fetchMovies(`/search/movie?query=${value}&include_adult=false&language=vi&page=1`);
    setSearchData(results);
  };

  useEffect(() => {
    if (!API_KEY) return;

    (async function () {
      const [trending, topRated] = await Promise.all([
        fetchMovies("/trending/movie/day?language=vi"),
        fetchMovies("/movie/top_rated?language=vi"),
      ]);

      setTrendingMovies(trending);
      setTopRatedMovies(topRated);
      console.log("Phim Hot:", trending);
      console.log("Phim Đề Cử:", topRated);
    })();
  }, []);

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <MovieProvider>
      <div className="h-full bg-black text-white min-h-screen pb-10 relative">
        <Header onSearch={handleSearch} />
        <Banner />

        {searchData.length === 0 && (
          <>
            <MovieList title="Phim Hot" data={trendingMovies.slice(0, 10)} />
            <MovieList title="Phim Đề Cử" data={topRatedMovies.slice(0, 10)} />
          </>
        )}

        {searchData.length > 0 && <MovieSearch data={searchData} />}
      </div>
    </MovieProvider>
  );
}

export default App;