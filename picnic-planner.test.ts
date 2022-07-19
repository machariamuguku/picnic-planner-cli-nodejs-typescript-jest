import fetch from "node-fetch";
import {
  queryNextWeekendWeatherForecast,
  isCold,
  isExpectedToRain,
  getDayNameFromDateTime,
  processWeatherData,
  chalkSuccess,
} from "./picnic-planner";
import {
  sampleLondonResp,
  sampleNairobiResp,
  sampleMarrakechResp,
} from "./fixtures";

const { Response } = jest.requireActual("node-fetch");
jest.mock("node-fetch", () => jest.fn());

global.console = {
  ...console,
  log: jest.fn(),
};

describe("picnic-planner-unit-tests", () => {
  const apiKey = "API_KEY";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns correct data given correct city and api key", async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      new Response(JSON.stringify(sampleLondonResp))
    );

    const res = await queryNextWeekendWeatherForecast("london", apiKey);
    expect(res).toEqual(sampleLondonResp);
  });

  it("returns error message if response not ok", async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(
      "some error"
    );
    const errorSpy = jest.fn();

    const res = await queryNextWeekendWeatherForecast("london", apiKey).catch(
      (err) => {
        errorSpy(err);
      }
    );
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith("some error");
  });

  it("isCold", () => {
    expect(isCold(9)).toBeTruthy();
    expect(isCold(12)).toBeFalsy();
  });

  it("isExpectedToRain", () => {
    expect(isExpectedToRain(9)).toBeTruthy();
    expect(isExpectedToRain(0)).toBeFalsy();
  });

  it("getDayNameFromDateTime", () => {
    expect(getDayNameFromDateTime("2022-07-23")).toEqual("Saturday");
    expect(getDayNameFromDateTime("2022-07-24")).toEqual("Sunday");
  });

  it("processWeatherData - no picnic day", () => {
    jest.spyOn(process, "exit").mockImplementationOnce(() => {
      throw new Error("process.exit() was called.");
    });
    const consoleSpy = jest.spyOn(global.console, "log");

    expect(() => {
      processWeatherData(sampleNairobiResp);
    }).toThrow("process.exit() was called.");

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      chalkSuccess(
        "The weather isn’t looking very good this weekend, maybe stay indoors."
      )
    );
  });

  it("processWeatherData - one picnic day", () => {
    jest.spyOn(process, "exit").mockImplementationOnce(() => {
      throw new Error("process.exit() was called.");
    });
    const consoleSpy = jest.spyOn(global.console, "log");

    expect(() => {
      processWeatherData(sampleMarrakechResp);
    }).toThrow("process.exit() was called.");

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      chalkSuccess("You should have your picnic on Saturday.")
    );
  });

  it("processWeatherData - two picnic days", () => {
    jest.spyOn(process, "exit").mockImplementationOnce(() => {
      throw new Error("process.exit() was called.");
    });
    const consoleSpy = jest.spyOn(global.console, "log");

    expect(() => {
      processWeatherData(sampleLondonResp);
    }).toThrow("process.exit() was called.");

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      chalkSuccess(
        "This weekend looks nice for a picnic, Saturday is best because it’s less windy."
      )
    );
  });
});
