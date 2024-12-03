import axios from "axios";

const baseUrl = "https://sky-scrapper.p.rapidapi.com/api/";

const getAirportId = async (airportCode) => {
  const response = await axios.get(
    baseUrl + `v1/flights/searchAirport?query=${airportCode}&localte=en-US`,
    {
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_API_KEY,
        "x-rapidapi-host": import.meta.env.VITE_API_HOST,
      },
    }
  );

  const skyId = response.data.data.find(
    (airport) => airport.skyId === airportCode
  ).skyId;
  const entityId = response.data.data.find(
    (airport) => airport.skyId === airportCode
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
};

export { getAirportId, getFlightDetails };
