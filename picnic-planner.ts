import chalk from "chalk";
import fetch from "node-fetch";
import { WeatherData, Day } from "./types";

const chalkError = chalk.bold.red;
const chalkWarning = chalk.hex("#FFA500");
const chalkSuccess = chalk.greenBright;

const queryNextWeekendWeatherForecast = async (
  city: string,
  apiKey: string
) => {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/nextweekend?include=days&elements=temp,precip,datetime,windspeed&unitGroup=metric&key=${apiKey}`
    );
    if (response.ok) {
      const weatherData: WeatherData = await response.json();
      return weatherData;
    }
    const errorMessage = await response.text();
    return Promise.reject(errorMessage);
  } catch (error) {
    return Promise.reject(error);
  }
};

const isCold = (temperature: Day["temp"]) => temperature < 10;

const isExpectedToRain = (precipitation: Day["precip"]) => precipitation > 0;

const getDayNameFromDateTime = (dateTime: Day["datetime"]) => {
  const date = new Date(dateTime);
  const day = date.toLocaleDateString("en-us", { weekday: "long" });
  return day;
};

const processWeatherData = (weatherData: WeatherData) => {
  const picnicDays = weatherData.days.filter(
    (day) => !isCold(day.temp) && !isExpectedToRain(day.precip)
  );

  if (!picnicDays.length) {
    console.log(
      chalkSuccess(
        "The weather isn’t looking very good this weekend, maybe stay indoors."
      )
    );
    process.exit(0);
  } else if (picnicDays.length === 1) {
    const day = getDayNameFromDateTime(picnicDays[0].datetime);
    console.log(chalkSuccess(`You should have your picnic on ${day}.`));
    process.exit(0);
  } else {
    const preferredPicnicDay = picnicDays.reduce((prevValue, currValue) => {
      if (currValue.windspeed < prevValue.windspeed) {
        return currValue;
      }
      return prevValue;
    }, picnicDays[0]);
    const day = getDayNameFromDateTime(preferredPicnicDay.datetime);
    console.log(
      chalkSuccess(
        `This weekend looks nice for a picnic, ${day} is best because it’s less windy.`
      )
    );
    process.exit(0);
  }
};

export {
  queryNextWeekendWeatherForecast,
  isCold,
  isExpectedToRain,
  getDayNameFromDateTime,
  processWeatherData,
  chalkError,
  chalkWarning,
  chalkSuccess,
};
