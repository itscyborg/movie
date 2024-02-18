import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Season = () => {
    const { id, seasonId } = useParams();
    const apiUrl = `${process.env.REACT_APP_TITLE_API}/${id}/season/${seasonId}`;
    const [seasonData, setSeasonData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [countdown, setCountdown] = useState(30);
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [selectedEpisodeIdx, setSelectedEpisodeIdx] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl);
                setSeasonData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [apiUrl]);

    const handleDownloadClick = async (episodeIdx) => {
        try {
            const selectedEpisode = seasonData.episodes.find(episode => episode.idx === episodeIdx);

            if (!selectedEpisode || !selectedEpisode.title) {
                console.error('Invalid episode object or missing title property.');
                return;
            }
            const api = process.env.REACT_APP_SEND_API;
            const title = `${seasonData.name} Season ${selectedEpisode.idx} ${selectedEpisode.title}`;
            await axios.post(api, { title });
            console.log("mssg sent ")
            setButtonDisabled(true);
            setSelectedEpisodeIdx(episodeIdx);

            setTimeout(async () => {
                const latestMessage = await getLatestTelegramMessage();
                const mssgLink = latestMessage.match(/Direct Link: (\S+)/)
                console.log(mssgLink[1])
                if (mssgLink == null && mssgLink[1]) {
                    // setDownloadLink(mssgLink[1]);
                    setFeedback('Link received! Opening in 10 seconds...');
                    window.open(mssgLink[1], '_blank');
                    setFeedback('Link opened in a new tab!');
                    // setDownloadLink(null);
                    setButtonDisabled(false);
                    setSelectedEpisodeIdx(null);
                } else {
                    setFeedback('No valid link received from Telegram.');
                    setButtonDisabled(false);
                    setSelectedEpisodeIdx(null);
                }
            }, 15000);


            setCountdown(30)
        } catch (err) {
            console.error("err while sending mssg", err);
            setSelectedEpisodeIdx(null);
        }
    }

    const getLatestTelegramMessage = async () => {
        try {
            const api = process.env.REACT_APP_REC_API
            const response = await axios.get(api);
            const latestMessageText = response.data.latestMessageText;
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

    const handleReport = () => {
        // Add your report logic here
        console.log("Report button clicked");
    };

    return (
        <div>
            {isLoading ? (
                <p>Loading season details...</p>
            ) : error ? (
                <p>Error fetching data: {error.message}</p>
            ) : (
                <div className="container mx-auto mt-10">
                    <h1 className="text-3xl font-semibold mb-6">Season {seasonData.season_id} </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {seasonData.episodes.map((episode) => (
                            <div key={episode.idx} className="relative bg-white rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform">
                                <img className="w-full h-48 object-cover" src={episode.image} alt={episode.title} loading="lazy" />
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-2">{`Episode ${episode.no}: ${episode.title}`}</h2>
                                    <p className="text-gray-600 mb-2">{`${episode.plot}`}</p>
                                    <p className="text-gray-600 mb-2">{`Published Date: ${episode.publishedDate}`}</p>
                                    <p className="text-gray-600">{`Rating: ${episode.rating.star} (${episode.rating.count} votes)`}</p>

                                    <div className="flex mt-4 space-x-4">
                                        <button className="bg-green-500 px-4 py-2 text-white rounded-full hover:bg-green-700"
                                            onClick={(e) => { e.stopPropagation(); handleDownloadClick(episode.idx); }}
                                            disabled={isButtonDisabled}
                                        >
                                            {selectedEpisodeIdx === episode.idx && isButtonDisabled ? `Downloading in ${countdown} seconds` : 'Download'}
                                        </button>
                                        <p>{feedback}</p>
                                        <button className="bg-red-500 px-4 py-2 text-white rounded-full hover:bg-red-700" onClick={handleReport}>
                                            Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Season;
