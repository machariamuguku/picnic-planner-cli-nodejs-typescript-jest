#!/usr/bin/env node
import "dotenv/config";
import chalk from "chalk";
import fetch from "node-fetch";
import { WeatherData } from "./types";

const apiKey = process.env.API_KEY;
const errorFn = chalk.bold.red;
const warningFn = chalk.hex("#FFA500");

const allArguments = process.argv;
const myArguments: string[] = allArguments.slice(2);

if (!apiKey) {
  console.log(errorFn("Api key missing"));
  process.exit(1);
}
if (!myArguments.length) {
  console.log(errorFn("Please pass in a city to picnic in"));
  process.exit(1);
}
if (myArguments.length > 1) {
  console.log(
    warningFn(
      `You've passed in more than one city. We'll attempt to use the first one. ('${myArguments[0]}')`
    )
  );
}

const queryWeatherApi = async (city: string, apiKey: string) => {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/nextweekend?unitGroup=metric&key=${apiKey}`
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
