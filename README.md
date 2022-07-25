# Nodejs Picnic Planner Cli Application

- Cli tool that recommends one of the weekend days as a picnic day if either of the weekend days are warm and dry, or staying indoors if both days are either rainy or cold
- Consumes the Visual Crossing Weather Forecasting [API](https://www.visualcrossing.com/)

## Assumptions

- Two Weekend days
- Cold days are `<10 deg C`
- Rainy days have precipitation > 0
- Passed in flag is a city

## Tech Stack

- Typescript
- Chalk
- Node Fetch
- Dotenv Config

## Steps

```bash
git clone git@github.com:machariamuguku/picnic-planner-cli-nodejs-typescript-jest.git && cd "$(basename "$_" .git)"
yarn install
yarn build
chmod u+x ./build/index.js
build/index.js city_name # or node build/index.js city_name
```

## Screenshots

![Nodejs Picnic Planner Cli Application](screenshots/1.png?raw=true "Nodejs Picnic Planner Cli Application")
