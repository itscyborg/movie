import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Review from "./Review";
import backgroundImage from "../assets/images/movieverse2.webp"
const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const apiUrl = `${process.env.REACT_APP_TITLE_API}/${id}`;

  const [movieData, setMovieData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(30);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        setMovieData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, apiUrl]);


  const handleSeasonClick = (seasonId) => {
    if (seasonId) {
      const seasonUrl = `/title/${id}/season/${seasonId}`;
      navigate(seasonUrl);
    } else {
      console.error("Season ID is undefined or null");
    }
  };

  const handleDownloadClick = async () => {
    try {
      const title = movieData.title;
      const year = movieData.releaseDetailed.year;
      const apiSend = `${process.env.REACT_APP_SEND_API}`;
      await axios.post(apiSend, { title, year });
      console.log("mssg sent ")
      setButtonDisabled(true);

      setTimeout(async () => {
        const latestMessage = await getLatestTelegramMessage();
        const mssgLink = latestMessage && latestMessage.match(/Direct Link: (\S+)/);
        console.log(mssgLink)
        if (mssgLink && mssgLink[1]) {
          setFeedback('Link received! Opening now...');
          window.open(mssgLink[1], '_blank');
          setFeedback('Link opened in a new tab!');
        } else {
          setFeedback('No valid link received from Telegram.');
        }
        setButtonDisabled(false);
      }, 15000);
      setCountdown(30)
    } catch (err) {
      console.error("err while sending mssg", err);
      setFeedback("Failed to send message.");
      setButtonDisabled(false);
    }
  }

  const getLatestTelegramMessage = async () => {
    try {
      const apiReceive = `${process.env.REACT_APP_REC_API}`;
      const response = await axios.get(apiReceive);
      const latestMessageText = response.data.latestMessageText;
      console.log(latestMessageText)
      return latestMessageText;

    } catch (error) {
      console.error('Error getting latest Telegram message:', error);
      return null;
    }
  };


  useEffect(() => {
    let timer;
    if (countdown > 0 && isButtonDisabled) {
      timer = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0 && isButtonDisabled) {
      setButtonDisabled(false);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [countdown, isButtonDisabled]);


  return (
    <div className=" min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {
        isLoading ? (
          <p className="text-white text-xl">Loading movie details...</p>
        ) : error ? (
          <p className="text-red-500 text-xl">Error fetching data: {error.message}</p>
        ) : (
          <div className="m-10 p-10 border-gray-800 border-2 max-w-4xl mx-auto bg-gray-800 text-white rounded-lg shadow-2xl" >
            <div className="flex flex-col md:flex-row">
              <img
                src={movieData.image}
                className="w-full md:w-60 h-auto object-cover rounded md:mr-10"
                alt={movieData.title}
              />
              <div className="mt-4 md:mt-0">
                <h1 className="text-4xl font-bold">{movieData.title}</h1>
                <p className="mt-2">Content Type: {movieData.contentType}</p>
                <p>Content Rating: {movieData.contentRating}</p>
                <p>Movie Status: {movieData.productionStatus}</p>
                <div className="mt-2">
                  <p className="font-bold">Genres:</p>
                  <div className="flex flex-wrap">
                    {movieData.genre.map((genre, index) => (
                      <span key={index} className="mr-2 last:mr-0">{genre}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-2">
                  <p className="font-bold">Actors:</p>
                  <ul>
                    {movieData.actors.map((actor, index) => (
                      <li key={index}>{actor}</li>
                    ))}
                  </ul>
                </div>
                <p className="mt-2 font-bold">Release Date:</p>
                <p>
                  {`${movieData.releaseDetailed.year}-${movieData.releaseDetailed.month}-${movieData.releaseDetailed.day}`}
                </p>
                <p className="font-bold mt-2">Total Seasons:</p>
                <p>{movieData.all_seasons ? movieData.all_seasons.length : 0}</p>
              </div>
            </div>

            <div className="mt-6">
              {movieData.contentType === "movie" && (
                <div className="flex flex-col items-center sm:flex-row justify-center">
                  <button className="bg-green-600 m-2 py-2 px-6 text-white font-bold rounded hover:bg-green-800 transition-colors duration-300"
                    onClick={handleDownloadClick}
                    disabled={isButtonDisabled}
                  >
                    {isButtonDisabled ? `Downloading in ${countdown} seconds` : 'Download'}
                  </button>
                  <p className="text-sm sm:mx-4 my-2 sm:my-0">{feedback}</p>
                  <button className="bg-blue-600 m-2 py-2 px-6 text-white font-bold rounded hover:bg-blue-800 transition-colors duration-300">
                    Telegram
                  </button>
                </div>
              )}

              {movieData.contentType === "tvSeries" && (
                <div className="mt-4 flex flex-wrap justify-center">
                  {movieData.all_seasons ? (
                    movieData.all_seasons.map((season, index) => (
                      <button
                        key={index}
                        className="bg-green-600 px-4 py-2 text-white shadow-lg rounded-full hover:bg-green-800 m-2 transition-colors duration-300"
                        onClick={() => handleSeasonClick(season.id)}
                      >
                        {season.name}
                      </button>
                    ))
                  ) : (
                    <p>No season data available</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      }
    </div >

  );
};

export default MovieDetails;
