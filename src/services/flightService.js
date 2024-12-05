import Axios from "axios";
import { setupCache } from "axios-cache-interceptor";

const baseUrl = "https://sky-scrapper.p.rapidapi.com/api/";

const instance = Axios.create();
const axios = setupCache(instance);

const getAirportOptions = async (location) => {
  const response = await axios.get(
    baseUrl + `v1/flights/searchAirport?query=${location}&localte=en-US`,
    {
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_API_KEY,
        "x-rapidapi-host": import.meta.env.VITE_API_HOST,
      },
    }
  );
  const result = response.data.data.map((flight) => flight.presentation);
  return result;
};

const getAirportId = async (location) => {
  const response = await axios.get(
    baseUrl + `v1/flights/searchAirport?query=${location}&localte=en-US`,
    {
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_API_KEY,
        "x-rapidapi-host": import.meta.env.VITE_API_HOST,
      },
    }
  );

  const skyId = response.data.data.find(
    (airport) => airport.presentation.title === location.trim()
  ).skyId;
  const entityId = response.data.data.find(
    (airport) => airport.presentation.title === location.trim()
  ).entityId;

  return [skyId, entityId];
};

const getFlightDetails = async (origin, destination, date, returnDate) => {
  const originId = origin[0];
  const originEntity = origin[1];
  const destinationId = destination[0];
  const destinationEntity = destination[1];
  const response = await axios.get(
    baseUrl +
      `v2/flights/searchFlights?originSkyId=${originId}&originEntityId=${originEntity}&destinationSkyId=${destinationId}&destinationEntityId=${destinationEntity}&date=${date}&returnDate=${returnDate}`,
    {
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_API_KEY,
        "x-rapidapi-host": import.meta.env.VITE_API_HOST,
      },
    }
  );
  console.log(response);
  return response;
};

export { getAirportId, getFlightDetails, getAirportOptions };
