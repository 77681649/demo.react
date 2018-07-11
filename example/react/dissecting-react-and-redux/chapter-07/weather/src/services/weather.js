export function requestWeather(cityID) {
  if (!cityID) {
    return Promise.reject(new Error("city_id is invalid."));
  }

  return fetch(`/data/cityinfo/${cityID}.html`, {
    headers: {
      "content-type": "application/json"
    }
  }).then(resp => resp.json());
}
