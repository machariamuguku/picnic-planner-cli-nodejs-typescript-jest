#!/usr/bin/env node
import "dotenv/config";
import chalk from "chalk";
import fetch from "node-fetch";
import { WeatherData, Day } from "./types";

const apiKey = process.env.API_KEY;
const errorFn = chalk.bold.red;
const warningFn = chalk.hex("#FFA500");
const successFn = chalk.greenBright;

const allArguments = process.argv;
const myArguments: string[] = allArguments.slice(2);
const city = myArguments[0];

if (!apiKey) {
  console.error(errorFn("Api key missing"));
  process.exit(1);
}
if (!myArguments.length) {
  console.error(errorFn("Please pass in a city to picnic in"));
  console.warn(warningFn(`Usage: ./build/index.js [CITY]`));
  process.exit(1);
}
if (myArguments.length > 1) {
  console.warn(
    warningFn(
      `You've passed in more than one city. We'll attempt to use the first one: ('${city}')`
    )
  );
}

const queryWeatherApi = async (city: string, apiKey: string) => {
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
  } catch (err) {
    return Promise.reject(err);
  }
};

const isCold = (temp: Day["temp"]) => {
  return temp < 10;
};

const isExpectedToRain = (precip: Day["precip"]) => {
  return precip > 0;
};

const getDayNameFromDateTime = (dateTime: string) => {
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
      successFn(
        "The weather isn’t looking very good this weekend, maybe stay indoors."
      )
    );
    process.exit(0);
  } else if (picnicDays.length === 1) {
    const day = getDayNameFromDateTime(picnicDays[0].datetime);
    console.log(successFn(`You should have your picnic on ${day}.`));
    process.exit(0);
  } else {
    const preferredPicnicDay = picnicDays.reduce((prevValue, currValue) => {
      if (currValue.windspeed > prevValue.windspeed) {
        return currValue;
      }
      return prevValue;
    });
    const day = getDayNameFromDateTime(preferredPicnicDay.datetime);
    console.log(
      successFn(
        `This weekend looks nice for a picnic, ${day} is best because it’s less windy.`
      )
    );
    process.exit(0);
  }
};

queryWeatherApi(city, apiKey)
  .then((weatherData) => processWeatherData(weatherData))
  .catch((err) => {
    console.error(errorFn(err));
    process.exit(1);
  });
