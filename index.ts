#!/usr/bin/env node
import chalk from "chalk";

const error = chalk.bold.red;
const warning = chalk.hex("#FFA500");

const allArguments = process.argv;
const myArguments: string[] = allArguments.slice(2);

if (!myArguments.length) {
  console.log(error("Please pass in a city to picnic in"));
  process.exit(1);
}
if (myArguments.length > 1) {
  console.log(
    warning(
      `You've passed in more than one city. We'll attempt to use the first one. ('${myArguments[0]}')`
    )
  );
}
