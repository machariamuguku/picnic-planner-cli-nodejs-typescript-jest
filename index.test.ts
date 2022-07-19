import fetch from "node-fetch";
import { sampleLondonResp } from "./fixtures";
import { chalkError, chalkWarning } from "./picnic-planner";

global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

const { Response } = jest.requireActual("node-fetch");
jest.mock("node-fetch", () => jest.fn());

describe("picnic-planner-integration-tests", () => {
  const currentArgv = process.argv;
  const currEnv = process.env;

  afterEach(() => {
    process.argv = currentArgv;
    process.env = currEnv;
    jest.clearAllMocks();
  });

  it("throws if api key missing", () => {
    process.env.API_KEY = "";

    jest.spyOn(process, "exit").mockImplementationOnce(() => {
      throw new Error("process.exit() was called.");
    });
    const consoleSpy = jest.spyOn(global.console, "error");

    expect(() => {
      require("./index.ts");
    }).toThrow("process.exit() was called.");

    expect(consoleSpy).toHaveBeenCalledWith(chalkError("Api key missing"));
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it("throws if no city argument passed", () => {
    process.env.API_KEY = "API_KEY";

    jest.spyOn(process, "exit").mockImplementationOnce(() => {
      throw new Error("process.exit() was called.");
    });
    const consoleErrorSpy = jest.spyOn(global.console, "error");
    const consoleWarnSpy = jest.spyOn(global.console, "warn");

    expect(() => {
      require("./index.ts");
    }).toThrow("process.exit() was called.");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      chalkError("Please pass in a city to picnic in")
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      chalkWarning("Usage: ./build/index.js [CITY]")
    );
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it("shows warning for more than two args", () => {
    process.env.API_KEY = "API_KEY";
    process.argv.push("jalapeno-city", "nairobi");

    jest.mock("./picnic-planner", () => ({
      ...jest.requireActual("./picnic-planner"),
      queryNextWeekendWeatherForecast: async () => jest.fn,
      processWeatherData: jest.fn,
    }));

    const consoleWarnSpy = jest.spyOn(global.console, "warn");

    require("./index.ts");

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      chalkWarning(
        "You've passed in more than one city. We'll attempt to use the first one: 'jalapeno-city'"
      )
    );
    expect(process.exit).not.toHaveBeenCalled();
  });
});
