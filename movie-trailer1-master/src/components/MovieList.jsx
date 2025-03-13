import PropTypes from "prop-types";
import { useContext } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { MovieContext } from "../context/MovieDetailContext";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 10,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1200 },
    items: 7,
  },
  tablet: {
    breakpoint: { max: 1200, min: 600 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 2,
  },
};

const MovieList = ({ title, data }) => {
  const { handleVideoTrailer, closeModal } = useContext(MovieContext);

  if (!data || data.length === 0) {
    return (
      <div className="my-10 px-10 max-w-full text-center">
        <h2 className="text-xl uppercase mb-4">{title}</h2>
        <p className="text-gray-400">Không có phim nào để hiển thị.</p>
      </div>
    );
  }

  return (
    <div className="my-10 px-10 max-w-full">
      <h2 className="text-xl uppercase mb-4">{title}</h2>
      <Carousel responsive={responsive} draggable={false} itemClass="px-2">
        {data.map((movie) => {
          const posterUrl = movie.poster_path
            ? `${import.meta.env.VITE_IMG_URL}${movie.poster_path}`
            : "https://via.placeholder.com/200x300?text=No+Image";

          const movieId = movie.id || Math.random().toString(36).substr(2, 9);

          return (
            <div
              key={movieId}
              className="bg-cover bg-no-repeat bg-center w-[200px] h-[300px] relative hover:scale-110 transition-transform duration-500 ease-in-out cursor-pointer"
              style={{ backgroundImage: `url(${posterUrl})` }}
              onClick={() => handleVideoTrailer(movie.id)}
            >
              <div className="bg-black w-full h-full opacity-40 absolute top-0 left-0 z-0" />
              <div className="relative p-4 flex flex-col items-center justify-end h-full">
                <h3 className="text-md uppercase text-white">
                  {movie.name || movie.title || movie.original_title || "No Title"}
                </h3>
              </div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

MovieList.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array,
};

export default MovieList;