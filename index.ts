#!/usr/bin/env node
import "dotenv/config";
import {
  chalkError,
  chalkWarning,
  queryNextWeekendWeatherForecast,
  processWeatherData,
} from "./picnic-planner";

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
      `You've passed in more than one city. We'll attempt to use the first one: '${city}'`
    )
  );
}

queryNextWeekendWeatherForecast(city, apiKey)
  .then((weatherData) => processWeatherData(weatherData))
  .catch((error) => {
    console.error(chalkError(error));
    process.exit(1);
  });
