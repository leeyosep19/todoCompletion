// StyledComponents.js
import styled from 'styled-components';

// Wrapper 컴포넌트: 전체적인 레이아웃을 감싸는 div
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  margin: 20px auto;
`;

// SpaceAround: 요소들 사이에 공간을 두는 div
export const SpaceAround = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

// WeatherWrapper: 날씨 정보를 감싸는 div
export const WeatherWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
`;

// ImgFlex: 아이콘 이미지를 flex로 정렬
export const ImgFlex = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`;

// WeatherImg: 날씨 아이콘 이미지
export const WeatherImg = styled.img`
  width: 50px;
  height: 50px;
`;

// WeatherText: 날씨 설명 텍스트
export const WeatherText = styled.p`
  font-size: 16px;
  color: #555;
  text-align: center;
`;

// MaxMin: 최고, 최저 온도 텍스트
export const MaxMin = styled.div`
  font-size: 14px;
  color: #777;
  margin: 10px 0;
`;

// HumidityText: 습도 텍스트
export const HumidityText = styled.div`
  font-size: 14px;
  color: #555;
  display: flex;
  align-items: center;
`;

// Margin: 공백을 추가하는 div
export const Margin = styled.div`
  height: ${(props) => props.height || '20px'};
`;

// TemperText: 온도 텍스트 스타일
export const TemperText = styled.h2`
  font-size: 36px;
  color: #333;
  margin: 0;
`;
