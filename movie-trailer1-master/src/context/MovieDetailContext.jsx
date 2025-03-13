import { createContext, useState } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import YouTube from "react-youtube";

const MovieContext = createContext();

// Đặt root element cho Modal (yêu cầu cho accessibility)
Modal.setAppElement("#root");

const opts = {
  height: "390",
  width: "640",
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1,
  },
};

const MovieProvider = ({ children }) => {
  const [trailerUrl, setTrailerUrl] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);

  const handleVideoTrailer = async (movieId) => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        // Sử dụng Bearer token nếu là API v4, hoặc bỏ nếu dùng API v3 với api_key trong URL
        // Authorization: `Bearer ${API_KEY}`, // Bỏ hoặc giữ tùy loại API
      },
    };

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US&api_key=${API_KEY}`,
        options
      );
      if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}`);
      }
      const data = await response.json();
      const trailer = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      setTrailerUrl(trailer ? trailer.key : "");
      setIsOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy video trailer:", error);
      setTrailerUrl(""); // Xóa trailerUrl nếu có lỗi
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setTrailerUrl(""); // Xóa trailerUrl khi đóng modal
  };

  return (
    <MovieContext.Provider value={{ handleVideoTrailer, closeModal }}>
      {children}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            zIndex: 9999,
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            background: "transparent",
            border: "none",
            padding: "0",
            maxWidth: "640px",
            width: "90%",
            height: "450px",
          },
        }}
        contentLabel="Movie Trailer Modal"
      >
        {trailerUrl ? (
          <div className="relative">
            <YouTube videoId={trailerUrl} opts={opts} />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Đóng
            </button>
          </div>
        ) : (
          <div className="text-center text-white p-4 bg-gray-800 rounded">
            <p>Không tìm thấy trailer cho phim này.</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Đóng
            </button>
          </div>
        )}
      </Modal>
    </MovieContext.Provider>
  );
};

MovieProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { MovieProvider, MovieContext };