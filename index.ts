#!/usr/bin/env node
import chalk from "chalk";
import fetch from "node-fetch";

const errorFn = chalk.bold.red;
const warningFn = chalk.hex("#FFA500");

const allArguments = process.argv;
const myArguments: string[] = allArguments.slice(2);

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

const queryWeatherApi = async (city: string) => {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/nextweekend?unitGroup=metric***REMOVED***`
    );
    const body = await response.text();
    return body;
  } catch (err) {
    console.log(errorFn(err));
    return Promise.reject();
  }
};
