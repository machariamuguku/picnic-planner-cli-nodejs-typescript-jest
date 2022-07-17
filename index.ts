#!/usr/bin/env node

const allArguments = process.argv;
const myArguments: string[] = process.argv.slice(2);

if (!myArguments.length) {
  console.log("Please pass in a city to picnic in");
  process.exit(1);
}
if (myArguments.length > 1) {
  console.log(
    "You've passed in more than one city. We'll attempt to use the first one"
  );
}
