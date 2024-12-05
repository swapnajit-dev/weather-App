import React, { useState, useEffect } from 'react';

const App = () => {
  const [city, setCity] = useState('Bhubaneswar');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  const currentDate = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = months[currentDate.getMonth()];
  const currentDay = currentDate.getDate();
  const currentYear = currentDate.getFullYear();
  const currentHour = currentDate.getHours();
  const currentMinute = String(currentDate.getMinutes()).padStart(2, '0');
  const currentMeridiem = currentHour >= 12 ? 'PM' : 'AM';
  const currentDateTime = `${currentDay} ${currentMonth} ${currentYear}, ${currentHour}:${currentMinute} ${currentMeridiem}`;

  const API_KEY = 'd786d13a67a3bed68090dc32a2a6c720';

  const getWeatherData = async () => {
    setError('');
    try {
      const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      const response = await fetch(API_URL);
      const data = await response.json();

      if (data.cod === '404') {
        throw new Error('City not found');
      }
      setWeatherData(data);
    } catch (error) {
      setError(error.message);
      setWeatherData(null);
    }
  };

  useEffect(() => {
    getWeatherData();
  }, []);

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleFormDataChange = (e) => {
    e.preventDefault();
    getWeatherData();
  };

  const getWeatherImage = (weatherCondition) => {
    switch (weatherCondition) {
      case 'Clouds':
        return '/assets/thunder.png';
      case 'Rain':
        return '/assets/rain_with_cloud.png';
      case 'Mist':
        return '/assets/Tornado.png';
      case 'Haze':
        return '/assets/sun.png';
      default:
        return '/assets/default.png'; 
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-r from-blue-800 to-purple-900 text-gray-200">
      <div className="flex items-center justify-center h-screen">
        <div className="h-auto w-full md:h-1/2 md:w-1/3 bg-blue-600 bg-opacity-90 text-white p-8 rounded-lg flex flex-col md:flex-row items-center gap-8 shadow-lg">
          {/* Left Section: Image */}
          {weatherData ? (
            <img
              src={getWeatherImage(weatherData.weather[0].main)}
              alt="Weather Icon"
              className="w-32 h-32 object-contain"
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center">Loading...</div>
          )}

          {/* Right Section: Content */}
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 id="Date" className="text-lg font-semibold">
              <span className="flex">{currentDateTime}</span>
            </h1>
            <h1 id="City" className="text-2xl font-bold">{weatherData?.name || city}</h1>
            <h1 id="temp" className="text-6xl font-extrabold">
              {weatherData?.main?.temp !== undefined ? `${weatherData.main.temp}°C` : '--°C'}
            </h1>
            <h1 id="weather" className="text-xl font-medium capitalize">
              {weatherData?.weather?.[0]?.description || 'Loading...'}
            </h1>
            <form onSubmit={handleFormDataChange} className="flex flex-col items-center gap-2">
              <input
                type="text"
                placeholder="Enter city name"
                className="w-full p-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                onChange={handleCityChange}
              />
              <button
                type="submit"
                className="bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700 transition-all"
              >
                Get Info.
              </button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
