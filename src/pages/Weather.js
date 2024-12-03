//npm install styled-components
//npm install react-icons   

//날씨 API 참조 https://openweathermap.org/api


import React, { Component } from 'react';
import axios from 'axios';
import { 
  Wrapper, 
  SpaceAround, 
  WeatherWrapper, 
  ImgFlex, 
  WeatherImg, 
  WeatherText, 
  MaxMin, 
  HumidityText, 
  Margin, 
  TemperText 
} from '../StyledComponents/StyledComponents.js';
import { SlDrop } from 'react-icons/sl'; // 아이콘

class Weather extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityName: 'Incheon', // 기본 도시 이름
      temp: 0,
      temp_max: 0,
      temp_min: 0,
      humidity: 0,
      desc: '',
      icon: '',
      loading: true,
      isCelsius: true, // 섭씨/화씨 단위 설정
    };
  }

  // 날씨 정보 가져오기
  fetchWeather = (lat, lon) => {
    const apiKey = process.env.REACT_APP_WEATHER_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    axios
      .get(url)
      .then((responseData) => {
        const data = responseData.data;
        this.setState({
          temp: data.main.temp,
          temp_max: data.main.temp_max,
          temp_min: data.main.temp_min,
          humidity: data.main.humidity,
          desc: data.weather[0].description,
          icon: data.weather[0].icon,
          loading: false,
        });
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        this.setState({ loading: false });
      });
  };

  // Geocoding API를 사용하여 도시 이름을 위도와 경도로 변환
  fetchGeoCoordinates = (cityName) => {
    const apiKey = process.env.REACT_APP_WEATHER_KEY;
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    axios
      .get(geoUrl)
      .then((response) => {
        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
          this.fetchWeather(lat, lon);
        } else {
          console.error('City not found');
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        console.error('Error fetching coordinates:', error);
        this.setState({ loading: false });
      });
  };

  // 도시 이름 변경 핸들러
  handleCityChange = (event) => {
    this.setState({ cityName: event.target.value });
  };

  // 날씨 조회 핸들러
  handleSearch = () => {
    this.setState({ loading: true });
    this.fetchGeoCoordinates(this.state.cityName);
  };

  render() {
    const { temp, temp_max, temp_min, humidity, desc, icon, loading, cityName } = this.state;
    const imgSrc = `http://openweathermap.org/img/w/${icon}.png`;

    return (
      <Wrapper>
        <SpaceAround>
          <div>
            <div>오늘의 날씨</div>
            <input
              type="text"
              value={cityName}
              onChange={this.handleCityChange}
              placeholder="Enter city name"
            />
            <button onClick={this.handleSearch}>검색</button>
          </div>
        </SpaceAround>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <SpaceAround>
              <div>
                <TemperText>{temp}°</TemperText>
              </div>
              <WeatherWrapper>
                <ImgFlex>
                  <WeatherImg src={imgSrc} alt={desc} />
                </ImgFlex>
                <WeatherText>{desc}</WeatherText>
              </WeatherWrapper>
            </SpaceAround>

            <Margin height="10" />
            <SpaceAround>
              <MaxMin>
                최고: {temp_max}° 최저: {temp_min}°
              </MaxMin>
              <HumidityText>
                <SlDrop size="17px" style={{ marginTop: '7px', marginRight: '8px' }} />
                {humidity}%
              </HumidityText>
            </SpaceAround>
          </div>
        )}
      </Wrapper>
    );
  }
}

export default Weather;
