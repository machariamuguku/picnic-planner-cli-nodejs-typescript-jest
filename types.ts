export interface Day {
  datetime: string;
  temp: number;
  precip: number;
  windspeed: number;
}

export interface WeatherData {
  queryCost: number;
  latitude: number;
  longitude: number;
  resolvedAddress: string;
  address: string;
  timezone: string;
  tzoffset: number;
  days: Day[];
}
