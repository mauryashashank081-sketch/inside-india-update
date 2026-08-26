"use client";

import { useEffect, useState } from "react";

type WeatherData = {
  city: string;
  temperature: number;
  weatherCode: number;
};

const MIRZAPUR = {
  city: "Mirzapur",
  latitude: 25.1337,
  longitude: 82.5644,
};

export default function WeatherBar() {
  const [weather, setWeather] = useState<WeatherData>({
    city: MIRZAPUR.city,
    temperature: 32,
    weatherCode: 0,
  });

  useEffect(() => {
    const getWeather = async (
      latitude: number,
      longitude: number,
      city: string
    ) => {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
      );

      if (!response.ok) {
        throw new Error("Weather request failed");
      }

      const data = await response.json();

      setWeather({
        city,
        temperature: Math.round(data.current.temperature_2m),
        weatherCode: data.current.weather_code,
      });
    };

    const loadWeather = () => {
      if (!navigator.geolocation) {
        getWeather(
          MIRZAPUR.latitude,
          MIRZAPUR.longitude,
          MIRZAPUR.city
        );
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            await getWeather(
              position.coords.latitude,
              position.coords.longitude,
              "Your Location"
            );
          } catch {
            await getWeather(
              MIRZAPUR.latitude,
              MIRZAPUR.longitude,
              MIRZAPUR.city
            );
          }
        },
        async () => {
          await getWeather(
            MIRZAPUR.latitude,
            MIRZAPUR.longitude,
            MIRZAPUR.city
          );
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 10 * 60 * 1000,
        }
      );
    };

    loadWeather();
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code === 0) return "☀️";
    if ([1, 2, 3].includes(code)) return "🌤️";
    if ([45, 48].includes(code)) return "🌫️";
    if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
    if ([61, 63, 65, 66, 67].includes(code)) return "🌧️";
    if ([71, 73, 75, 77].includes(code)) return "❄️";
    if ([80, 81, 82].includes(code)) return "🌦️";
    if ([95, 96, 99].includes(code)) return "⛈️";

    return "🌤️";
  };

  return (
    <div className="flex w-full items-center justify-center gap-2 overflow-hidden whitespace-nowrap text-[11px] font-semibold text-slate-600 sm:justify-end sm:gap-4 sm:text-xs">
      <span>
        {new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </span>

      <span className="text-slate-300">|</span>

      <span className="max-w-[90px] truncate">
        {weather.city}
      </span>

      <span className="text-slate-300">|</span>

      <span>{weather.temperature}°C</span>

      <span>{getWeatherIcon(weather.weatherCode)}</span>
    </div>
  );
}