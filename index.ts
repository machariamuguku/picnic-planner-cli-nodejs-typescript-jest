#!/usr/bin/env node
import "dotenv/config";
import chalk from "chalk";
import fetch from "node-fetch";
import { WeatherData, Day } from "./types";

const chalkError = chalk.bold.red;
const chalkWarning = chalk.hex("#FFA500");
const chalkSuccess = chalk.greenBright;

const apiKey = process.env.API_KEY;
const allArguments = process.argv;
const myArguments: string[] = allArguments.slice(2);
const city = myArguments[0];

if (!apiKey) {
  console.error(chalkError("Api key missing"));
  process.exit(1);
}
if (!myArguments.length) {
  console.error(chalkError("Please pass in a city to picnic in"));
  console.warn(chalkWarning(`Usage: ./build/index.js [CITY]`));
  process.exit(1);
}
if (myArguments.length > 1) {
  console.warn(
    chalkWarning(
      `You've passed in more than one city. We'll attempt to use the first one: ('${city}')`
    )
  );
}

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
    } else {
      const errorMessage = await response.text();
      return Promise.reject(errorMessage);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const isCold = (temperature: Day["temp"]) => {
  return temperature < 10;
};

const isExpectedToRain = (precipitation: Day["precip"]) => {
  return precipitation > 0;
};

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

queryNextWeekendWeatherForecast(city, apiKey)
  .then((weatherData) => processWeatherData(weatherData))
  .catch((error) => {
    console.error(chalkError(error));
    process.exit(1);
  });
