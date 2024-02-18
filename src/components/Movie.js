import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/images/movieverse.webp';
import ShimmerEffect from './ShimmerEffect';

const Movie = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [movieData, setMovieData] = useState([]);

    const handleSearch = async (query) => {
        const Api = process.env.REACT_APP_SEARCH_API;
        const searchApi = `${Api}?query=${query}`
        try {
            const response = await axios.get(searchApi);
            setMovieData(response.data.results)
            console.log(response.data.results)

        } catch (err) {
            console.log(err)
            setMovieData([])
        }

    }

    useEffect(() => {
        handleSearch(searchQuery);
    }, [searchQuery])

    return (
        <div className="bg-image-container" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

            <div className="flex flex-col items-center justify-center min-h-screen relative ">

                <div className="container mx-auto max-w-3xl p-4 rounded-lg shadow-md bg-red-transparent">

                    <div className="flex flex-wrap -mx-2 items-center">
                        <div className="px-2 w-full sm:w-auto flex-grow">
                            <input
                                type="text"
                                value={searchQuery}
                                placeholder="Search Movie ..."
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full text-justify px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 text-gray-700 placeholder-gray-500 shadow-sm transition ease-in-out duration-150"
                            />
                        </div>
                        <div className="px-2 mt-2 sm:mt-0">
                            <button
                                id="search-button"
                                onClick={() => handleSearch(searchQuery)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition ease-in-out duration-150"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>


                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {movieData && movieData.length > 0 ? (
                            movieData.map((movie, index) => (
                                <Link to={`/movie-details/${movie.id}`} key={index} className="group">
                                    <div className="  flex flex-col rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                                        <div className="relative h-56">
                                            <img
                                                className="absolute inset-0 w-full h-full object-cover"
                                                src={movie.image}
                                                alt={movie.title}
                                            />
                                        </div>
                                        <div className="flex-1 animated-gradient p-4 flex flex-col items-center">
                                            <h2 className="text-white text-center font-semibold text-md lg:text-lg mb-2 group-hover:text-indigo-400 transition duration-300">
                                                {movie.title}
                                            </h2>
                                            <p className="text-white text-center text-xs lg:text-sm">Release Date: {movie.year}</p>
                                            <p className="text-white text-center text-xs lg:text-sm">Type: {movie.type}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p></p>

                        )}
                    </div>
                </div>




            </div>
        </div>
    );
}

export default Movie