// DisplayWeather.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { AiOutlineSearch } from 'react-icons/ai';
import { WiHumidity } from 'react-icons/wi';
import { CiHome } from 'react-icons/ci';
import { GiWindSlap } from 'react-icons/gi';
import { BsFillSunFill, BsCloudyFill, BsCloudFog2Fill, BsFillCloudRainFill } from 'react-icons/bs';
import { RiLoaderFill } from 'react-icons/ri';
import { TiWeatherPartlySunny } from 'react-icons/ti';
import { CgDarkMode } from "react-icons/cg";

const MainWrapper = styled.div`
    height: 100vh;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
`;

const Container = styled.div`
    background-color: ${({ theme }) => theme.containerBackground};
    border-radius: 12px;
    padding: 2rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 10px 15px ${({ theme }) => theme.boxShadow};
    box-sizing: border-box;
    background-blend-mode: overlay;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    position: absolute;
`;

const SearchArea = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
`;

const SearchCircle = styled.div`
    border: 1px solid ${({ theme }) => theme.searchCircleBorder};
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`;

const SearchInput = styled.input`
    outline: none;
    border: 1px solid grey;
    padding: 8px;
    border-radius: 20px;
    text-align: center;
    width: 80%;
    background: transparent;
`;

const WeatherArea = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 30px 0;
`;

const Icon = styled.div`
    font-size: 9rem;
`;

const BottomInfoArea = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 10px;
    background: ${({ theme }) => theme.bottomInfoBackground};
    border-radius: 12px;
    padding: 10px;
`;

const HumidityLevel = styled.div`
    display: flex;
    align-items: center;
    margin: 0 20px;
`;

const Wind = styled.div`
    display: flex;
    align-items: center;
    margin: 0 20px;
`;

const Loading = styled.div`
    height: 400px;
    width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
`;

const toggleDarkMode = {
    background: 'linear-gradient(to left, #333333, #444444)',
    text: '#f2f2f2',
    containerBackground: '#333333',
    boxShadow: 'rgba(0, 0, 0, 0.5)',
    searchCircleBorder: '#444444',
    bottomInfoBackground: 'linear-gradient(90deg, #333333, #444444)'
};

const toggleLightMode = {
    background: 'linear-gradient(to bottom, #f2f2f2, #e5e5e5, #d3d3d3)',
    text: '#333333',
    containerBackground: '#f2f2f2',
    boxShadow: 'rgba(0, 0, 0, 0.1)',
    searchCircleBorder: '#d3d3d3',
    bottomInfoBackground: 'linear-gradient(90deg, #f2f2f2, #e5e5e5)'
};

const DisplayWeather = () => {
    const api_Endpoint = 'https://api.openweathermap.org/data/2.5/';
    const api_key = '0cc86d16bf572f78cdc96c096c7627e5';

    const [weatherData, setWeatherData] = useState<WeatherDataProps | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchCity, setSearchCity] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const fetchCurrentWeather = async (lat: number, lon: number) => {
        const url = `${api_Endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
        const response = await axios.get(url);
        return response.data;
    };

    const fetchWeatherData = async (city: string) => {
        try {
            const url = `${api_Endpoint}weather?q=${city}&appid=${api_key}&units=metric`;
            const searchResponse = await axios.get(url);
            const currentWeatherData: WeatherDataProps = searchResponse.data;
            return { currentWeatherData };
        } catch (error) {
            console.error('No data found');
            throw error;
        }
    };

    const handleSearch = async () => {
        if (searchCity.trim() === '') {
            return;
        }
        try {
            const { currentWeatherData } = await fetchWeatherData(searchCity);
            setWeatherData(currentWeatherData);
        } catch (error) {
            console.error('No results found');
        }
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    const iconChanger = (weather: string) => {
        let iconElement: React.ReactNode;
        let iconColor: string;
        switch (weather) {
            case 'Rain':
                iconElement = <BsFillCloudRainFill />;
                iconColor = '#272829';
                break;
            case 'Clear':
                iconElement = <BsFillSunFill />;
                iconColor = '#FFC436';
                break;
            case 'Clouds':
                iconElement = <BsCloudyFill />;
                iconColor = '#102C57';
                break;
            case 'Mist':
                iconElement = <BsCloudFog2Fill />;
                iconColor = '#279EFF';
                break;
            default:
                iconElement = <TiWeatherPartlySunny />;
                iconColor = '#7B2869';
        }
        return <span className="icon" style={{ color: iconColor }}> {iconElement}</span>;
    };

    useEffect(() => {
        const fetchData = async () => {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                const [currentWeather] = await Promise.all([fetchCurrentWeather(latitude, longitude)]);
                setWeatherData(currentWeather);
                setIsLoading(true);
            });
        };
        fetchData();
    }, []);

    const toggleColorMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <MainWrapper theme={isDarkMode ? toggleDarkMode : toggleLightMode}>
            <Container>
                <h1>Weather App</h1>
                <button onClick={toggleColorMode} style={{
                    color: 'black',
                    backgroundColor: 'white',
                    fontSize: '15px',
                    padding: '5px 10px',
                    borderRadius: '2px',
                    cursor: 'pointer',
                }}><CgDarkMode /></button>

                <SearchArea>
                    <SearchCircle>
                        <CiHome className="searchIcon" onClick={handleRefresh} />
                    </SearchCircle>
                    <SearchInput
                        type="text"
                        placeholder="Enter a city.."
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                    />
                    <SearchCircle>
                        <AiOutlineSearch className="searchIcon" onClick={handleSearch} />
                    </SearchCircle>
                </SearchArea>

                {weatherData && isLoading ? (
                    <>
                        <WeatherArea>
                            <h1>{weatherData.name}</h1>
                            <span>{weatherData.sys.country}</span>
                            <Icon>{iconChanger(weatherData.weather[0].main)}</Icon>
                            <h1>{weatherData.main.temp}</h1>
                            <h2>{weatherData.weather[0].main}</h2>
                        </WeatherArea>

                        <BottomInfoArea>
                            <HumidityLevel>
                                <WiHumidity className="windIcon" />
                                <div className="humidInfo">
                                    <h2>{weatherData.main.humidity}%</h2>
                                    <p>Humidity</p>
                                </div>
                            </HumidityLevel>

                            <Wind>
                                <GiWindSlap className="windIcon" />
                                <div className="humidInfo">
                                    <h2>{weatherData.wind.speed} Km/Hr </h2>
                                    <p>Wind speed</p>
                                </div>
                            </Wind>
                        </BottomInfoArea>
                    </>
                ) : (
                    <Loading>
                        <RiLoaderFill className="loadingIcon" />
                        <p>Loading..</p>
                    </Loading>
                )}
            </Container>
        </MainWrapper>
    );
};

export default DisplayWeather;

interface WeatherDataProps {
    name: string;
    main: {
        temp: number;
        humidity: number;
    };
    sys: {
        country: string;
    };
    weather: {
        main: string;
    }[];
    wind: {
        speed: number;
    };
};
