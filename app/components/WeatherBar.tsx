"use client";

import { useEffect, useState } from "react";

type WeatherData = {
  temperature: number;
  weatherCode: number;
};

const NEW_DELHI = {
  latitude: 28.6139,
  longitude: 77.209,
};

export default function WeatherBar() {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 27,
    weatherCode: 0,
  });

  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const updateDayNight = () => {
      const hour = Number(
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }).format(new Date())
      );

      // 6 AM to 6 PM = day
      setIsNight(hour < 6 || hour >= 18);
    };

    const getWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${NEW_DELHI.latitude}&longitude=${NEW_DELHI.longitude}&current=temperature_2m,weather_code&timezone=Asia%2FKolkata`
        );

        if (!response.ok) {
          throw new Error("Weather request failed");
        }

        const data = await response.json();

        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          weatherCode: data.current.weather_code,
        });
      } catch {
        // Keep default value if weather API fails
      }
    };

    updateDayNight();
    getWeather();

    // Check day/night every minute
    const timer = setInterval(updateDayNight, 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  const getWeatherIcon = (code: number) => {
    // At night, show moon for clear/mostly-clear weather
    if (isNight && [0, 1, 2].includes(code)) {
      return "🌙";
    }

    if (code === 0) return "☀️";
    if ([1, 2, 3].includes(code)) return "🌤️";
    if ([45, 48].includes(code)) return "🌫️";
    if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
    if ([61, 63, 65, 66, 67].includes(code)) return "🌧️";
    if ([71, 73, 75, 77].includes(code)) return "❄️";
    if ([80, 81, 82].includes(code)) return "🌦️";
    if ([95, 96, 99].includes(code)) return "⛈️";

    return isNight ? "🌙" : "🌤️";
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  return (
    <div className="flex w-full items-center justify-center overflow-hidden whitespace-nowrap text-[11px] font-semibold text-slate-600 sm:justify-end sm:text-xs">
      <span>{formattedDate}</span>

      <span className="mx-2 text-slate-300">|</span>

      <span>New Delhi</span>

      <span className="ml-1">
        {weather.temperature}°C
      </span>

      <span className="ml-1.5">
        {getWeatherIcon(weather.weatherCode)}
      </span>
    </div>
  );
}