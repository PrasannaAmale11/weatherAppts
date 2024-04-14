import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// background images
import cloudsImage from '../assets/clouds.jpg';
import sunnyImage from '../assets/sunny.jpg';
import rainImage from '../assets/closeup-shot-window-rainy-day-raindrops-rolling-down-window.jpg';
import normal from '../assets/normal.jpg';

interface WeatherData {
  temperature: number;
  visibility: number; 
  alerts: any[]; 
  hourly: any[]; 
  daily: any[]; 
  feels_like: number; 
  pressure: number; 
  humidity: number;  
  wind_deg: number;  
  wind_speed: number;  
  wind_gust: number;  
  
  weather: { main: string }[];  
}

const WeatherInfo: React.FC = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const locationResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=9de243494c0b295cca9337e1e96b00e2`
        );

        const { lat, lon } = locationResponse.data.coord;


        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=9de243494c0b295cca9337e1e96b00e2`
        );

        const weatherData: WeatherData = {
          temperature: weatherResponse.data.current.temp,
          visibility: weatherResponse.data.current.visibility,
          alerts: weatherResponse.data.alerts,
          hourly: weatherResponse.data.hourly,
          daily: weatherResponse.data.daily,
          feels_like: weatherResponse.data.current.feels_like,
          pressure: weatherResponse.data.current.pressure,
          humidity: weatherResponse.data.current.humidity,
          weather: weatherResponse.data.current.weather,
          wind_speed: weatherResponse.data.current.wind_speed,
          wind_deg: weatherResponse.data.current.wind_deg,
          wind_gust: weatherResponse.data.current.wind_gust,
        };

        setWeatherData(weatherData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [cityName]);

 
  const getBackgroundImage = () => {
    if (!weatherData) return ''; 

    const weatherMain = weatherData.weather[0].main;

    // background image on weather condition
    switch (weatherMain) {
      case 'Clouds':
        return `url(${cloudsImage})`;
      case 'Clear':
        return `url(${sunnyImage})`;
      case 'Rain':
        return `url(${rainImage})`;
      default:
        return `url(${normal})`;
    }
  };

  return (
    <div className='wrapper h-screen w-screen flex items-center justify-center' style={{ backgroundImage: getBackgroundImage(), backgroundSize: 'cover' }}>
      <div className="innerWrapper ">
        {loading ? (
          <div>Loading...</div>
        ) : !weatherData ? (
          <>
          <div className="section w-full flex flex-col items-center justify-center ">
  <h1 className="error">404</h1>
  <div className="page">Ooops!!! The page you are looking for is not found</div>
  <a className="back-home" href="/">Back to home</a>
</div>
          </>
        ) : (
          <>

          <div className="tempAndlocationDiv flex flex-col w-[45%] justify-between">

          <div className="locationDiv flex justify-start items-center gap-3 w-full rounded-3xl  text-white text-left p-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="white" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"/></svg> Weather in {cityName}
          </div>

          <div className="mainTempcol h-[90%] flex flex-col justify-around">
            <div className="tempDiv">
          <h4 className=' text-[75px] text-white text-center font-bold '> {(weatherData.temperature - 273.15).toFixed(1)}°</h4>
          <p className=' text-[30px] text-white text-center font-bold uppercase'>{weatherData.weather[0].main}</p>
          </div>
          <div className="tabs flex flex-wrap gap-2 justify-around " >
          <div className='flex flex-col justify-start items-start p-3 squareTab'>
           <h4 className=' feelsLike flex items-center gap-3 text-[25px] uppercase'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="rgb(97 116 133)" d="M13 17.26V6a4 4 0 0 0-8 0v11.26a7 7 0 1 0 8 0M9 4a2 2 0 0 1 2 2v7H7V6a2 2 0 0 1 2-2m0 24a5 5 0 0 1-2.5-9.33l.5-.28V15h4v3.39l.5.28A5 5 0 0 1 9 28M20 4h10v2H20zm0 6h7v2h-7zm0 6h10v2H20zm0 6h7v2h-7z"/></svg>Feels Like
            </h4>
            <h4 className='text-white text-[35px] tabstext' >
            {(weatherData.feels_like - 273.15).toFixed(1)}°C
            </h4>
            
            </div>
            <div className='flex flex-col justify-start items-start p-3 squareTab'>
            <h4 className=' feelsLike flex items-center gap-3 text-[25px] uppercase'>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="#617485"><path stroke-linecap="round" d="M20.693 17.33a9 9 0 1 0-17.386 0"/><path d="M12.766 15.582c.487.71.144 1.792-.766 2.417c-.91.626-2.043.558-2.53-.151c-.52-.756-2.314-5.007-3.403-7.637c-.205-.495.4-.911.79-.542c2.064 1.96 5.39 5.157 5.909 5.913Z"/><path stroke-linecap="round" d="M12 6v2m-6.364.636L7.05 10.05m11.314-1.414L16.95 10.05m3.743 7.28l-1.931-.518m-15.455.518l1.931-.518"/></g></svg>Pressure
            </h4>
            <h4 className='text-white text-[35px] tabstext'>
               {weatherData.pressure}Pa
               </h4>
               </div>

               <div className='flex flex-col justify-start items-start p-3 squareTab'>
            <h4 className=' feelsLike flex items-center gap-3 text-[25px] uppercase'>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="#617485" d="M26 12a3.898 3.898 0 0 1-4-3.777a3.902 3.902 0 0 1 .653-2.064l2.517-3.745a1.038 1.038 0 0 1 1.66 0l2.485 3.696A3.97 3.97 0 0 1 30 8.223A3.898 3.898 0 0 1 26 12m0-7.237l-1.656 2.463a1.89 1.89 0 0 0-.344.997a2.014 2.014 0 0 0 4 0a1.98 1.98 0 0 0-.375-1.047zM23.5 30h-15a6.496 6.496 0 0 1-1.3-12.862a8.994 8.994 0 0 1 17.6 0A6.496 6.496 0 0 1 23.5 30M16 12a7 7 0 0 0-6.941 6.145l-.1.812l-.815.064A4.496 4.496 0 0 0 8.5 28h15a4.496 4.496 0 0 0 .356-8.979l-.815-.064l-.099-.812A7.002 7.002 0 0 0 16 12"/></svg>Humidity
            </h4>
            <h4 className='text-white text-[35px] tabstext'>
            {weatherData.humidity}%
               </h4>
               </div>
               <div className='flex flex-col justify-start items-start p-3 squareTab'>
            <h4 className=' feelsLike flex items-center gap-3 text-[25px] uppercase'>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="#617485" d="M243.66 126.38c-.34-.76-8.52-18.89-26.83-37.2C199.87 72.22 170.7 52 128 52S56.13 72.22 39.17 89.18c-18.31 18.31-26.49 36.44-26.83 37.2a4.08 4.08 0 0 0 0 3.25c.34.77 8.52 18.89 26.83 37.2c17 17 46.14 37.17 88.83 37.17s71.87-20.21 88.83-37.17c18.31-18.31 26.49-36.43 26.83-37.2a4.08 4.08 0 0 0 0-3.25m-32.7 35c-23.07 23-51 34.62-83 34.62s-59.89-11.65-83-34.62A135.71 135.71 0 0 1 20.44 128A135.69 135.69 0 0 1 45 94.62C68.11 71.65 96 60 128 60s59.89 11.65 83 34.62A135.79 135.79 0 0 1 235.56 128A135.71 135.71 0 0 1 211 161.38ZM128 84a44 44 0 1 0 44 44a44.05 44.05 0 0 0-44-44m0 80a36 36 0 1 1 36-36a36 36 0 0 1-36 36"/></svg>Visiblity
            </h4>
            <h4 className='text-white text-[35px] tabstext'>
            {weatherData.visibility} meters
               </h4>
               </div>
            
          </div>
          
          </div>

          </div>
           
      
  <div className="forcastDiv flex flex-col w-[45%]">
    <div className="innerForcastDiv justify-around flex flex-col h-full">
      <div className="hourlyDiv p-3 flex flex-col justify-between">
      <h2 className='feelsLike flex items-center gap-3 text-[18px] uppercase'>Hourly Forecast</h2>
      <p className="divide"></p>

          <div className="scrollable overflow-x-scroll flex gap-5">
      {weatherData.hourly.map((hour: any, index: number) => (
        <div key={index} className='flex flex-col gap-2 mb-1'>
          <p className='text-white'>{new Date(hour.dt * 1000).toLocaleTimeString()}</p> 
          <p className='text-white'>{(hour.temp - 273.15).toFixed(1)}°C</p>
          <p className='text-white uppercase'>{hour.weather[0].main}</p>
          
        </div>
      ))}
      </div>
      </div>


      <div className="hourlyDiv p-3 flex flex-col justify-between">
      <h2 className='feelsLike flex items-center gap-3 text-[18px] uppercase'>Daily Forecast</h2>
      <p className="divide"></p>

          <div className="scrollable overflow-x-scroll flex gap-5">
          {weatherData.daily.map((day: any, index: number) => (
        <div key={index} className='flex flex-col gap-2 mb-1'>
          <p className='text-white'> {new Date(day.dt * 1000).toLocaleDateString()}</p> 
          <p className='text-white'>{(day.temp.day - 273.15).toFixed(1)}°C</p>
          <p className='text-white uppercase'>{day.weather[0].main}</p>
          
        </div>
      ))}
      </div>
      </div>
  

      <div className='flex flex-col justify-start items-start p-3 squareTab forcastTab gap-2'>
            <h4 className=' feelsLike flex items-center gap-3 text-[20px] uppercase'>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#617485" d="M20.27,4.74a4.93,4.93,0,0,1,1.52,4.61,5.32,5.32,0,0,1-4.1,4.51,5.12,5.12,0,0,1-5.2-1.5,5.53,5.53,0,0,0,6.13-1.48A5.66,5.66,0,0,0,20.27,4.74ZM12.32,11.53a5.49,5.49,0,0,0-1.47-6.2A5.57,5.57,0,0,0,4.71,3.72,5.17,5.17,0,0,1,9.53,2.2,5.52,5.52,0,0,1,13.9,6.45,5.28,5.28,0,0,1,12.32,11.53ZM19.2,20.29a4.92,4.92,0,0,1-4.72,1.49,5.32,5.32,0,0,1-4.34-4.05A5.2,5.2,0,0,1,11.6,12.5a5.6,5.6,0,0,0,1.51,6.13A5.63,5.63,0,0,0,19.2,20.29ZM3.79,19.38A5.18,5.18,0,0,1,2.32,14a5.3,5.3,0,0,1,4.59-4,5,5,0,0,1,4.58,1.61,5.55,5.55,0,0,0-6.32,1.69A5.46,5.46,0,0,0,3.79,19.38ZM12.23,12a5.11,5.11,0,0,0,3.66-5,5.75,5.75,0,0,0-3.18-6,5,5,0,0,1,4.42,2.3,5.21,5.21,0,0,1,.24,5.92A5.4,5.4,0,0,1,12.23,12ZM11.76,12a5.18,5.18,0,0,0-3.68,5.09,5.58,5.58,0,0,0,3.19,5.79c-1,.35-2.9-.46-4-1.68A5.51,5.51,0,0,1,11.76,12ZM23,12.63a5.07,5.07,0,0,1-2.35,4.52,5.23,5.23,0,0,1-5.91.2,5.24,5.24,0,0,1-2.67-4.77,5.51,5.51,0,0,0,5.45,3.33A5.52,5.52,0,0,0,23,12.63ZM1,11.23a5,5,0,0,1,2.49-4.5,5.23,5.23,0,0,1,5.81-.06,5.3,5.3,0,0,1,2.61,4.74A5.56,5.56,0,0,0,6.56,8.06,5.71,5.71,0,0,0,1,11.23Z"><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>Wind
            </h4>
            <h4 className='text-white text-[35px] w-full flex gap-3'>
            {weatherData.wind_speed} <div className="unitDiv ml-1 flex flex-col items-center justify-center gap-3"> <span className='unit'>MPS</span> <span className=' text-[18px] text-white'>Wind</span>
            </div>
               </h4>
               <div className="divide"></div>
               <h4 className='text-white text-[35px] w-full flex gap-3'>
               {weatherData.wind_gust} <div className="unitDiv ml-1 flex flex-col items-center justify-center gap-3"> <span className='unit'>MPS</span> <span className=' text-[18px] text-white'>Gusts</span>
            </div>
               </h4>
               <div className="divide"></div>
               <h4 className='text-white text-[35px] w-full flex gap-3'>
               {weatherData.wind_deg} <div className="unitDiv ml-1 flex flex-col items-center justify-center gap-3"> <span className='unit'>Deg</span> <span className=' text-[18px] text-white'>Angle</span>
            </div>
               </h4>
               </div>

    </div>
  </div>
  


          </>
        )}
      </div>
    </div>
  );
};

export default WeatherInfo;
