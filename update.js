const fs = require("fs");
const path = require("path");
const parse = require("csv-parse/lib/sync");

const FILENAME_CONFIRMED = "time_series_covid19_confirmed_global.csv";
const FILENAME_DEATHS = "time_series_covid19_deaths_global.csv";
const FILENAME_RECOVERED = "time_series_covid19_recovered_global.csv";
const COUNTRIES_GEOJSON = "countries.geojson";

function readCountriesGeojson(countriesGeoPath) {
  let countriesGeoData = JSON.parse(fs.readFileSync(countriesGeoPath));
  let countryIsoMap = {}
  let countryGeoMap = {}
  for(let featureIndex in countriesGeoData["features"]) {
    let feature = countriesGeoData["features"][featureIndex];
    countryIsoMap[feature["properties"]["name"]] = feature["id"];
    countryGeoMap[feature["properties"]["name"]] = feature["geometry"];
  }
  return [countryIsoMap, countryGeoMap];
}

function extract(filepath) {
  const csv = fs.readFileSync(filepath);
  const [headers, ...rows] = parse(csv);
  const [province, country, lat, long, ...dates] = headers;
  const countList = {};

  // HACK: CSVs have different date formats
  const normalDates = dates.map(date => {
    const [month, day] = date.split("/");
    return `2020-${month}-${day}`;
  });

  rows.forEach(([province, country, lat, long, ...counts]) => {
    countList[country] = countList[country] || {};
    normalDates.forEach((date, i) => {
      countList[country][date] = countList[country][date] || 0;
      countList[country][date] += +counts[i];
    });
  });
  return [countList, normalDates];
}

function createGeojson(countryIsoMap, countryGeoMap, countryCovidCountMap) {
  let geojsonResult = {}
  geojsonResult["type"] = "FeatureCollection";
  geojsonResult["features"] = [];
  for(let country in countryIsoMap) {
    let geojsonFeature = {}
    geojsonFeature["type"] = "Feature";
    geojsonFeature["id"] = country;
    geojsonFeature["properties"] = {};
    geojsonFeature["properties"]["iso"] = countryIsoMap[country];
    geojsonFeature["properties"]["name"] = country;
    if (countryCovidCountMap[country] === undefined) {
      continue
    }
    const covidInfo = countryCovidCountMap[country];
    geojsonFeature["properties"]["dates"] = {};
    for(let itemIndex in covidInfo) {
      let item = covidInfo[itemIndex];
      let crdCounts = {};
      crdCounts["confirmed"] = item["confirmed"];
      crdCounts["recovered"] = item["recovered"];
      crdCounts["deaths"] = item["deaths"];
      geojsonFeature["properties"]["dates"][item["date"]] = crdCounts;
    }
    lastCovidItem = covidInfo[covidInfo.length - 1];
    geojsonFeature["properties"]["current_confirmed"] = lastCovidItem["confirmed"];
    geojsonFeature["properties"]["current_recovered"] = lastCovidItem["recovered"];
    geojsonFeature["properties"]["current_deaths"] = lastCovidItem["deaths"];
    geojsonFeature["geometry"] = countryGeoMap[country];
    geojsonResult["features"].push(geojsonFeature);
  }
  return geojsonResult;
}

function update(dataPath, inputDir, outputDir) {
  const [confirmed, dates] = extract(
    path.resolve(dataPath, FILENAME_CONFIRMED)
  );
  const [deaths] = extract(path.resolve(dataPath, FILENAME_DEATHS));
  const [recovered] = extract(path.resolve(dataPath, FILENAME_RECOVERED));
  const countries = Object.keys(confirmed);
  const jsonResults = {};

  countries.forEach(country => {
    jsonResults[country] = dates.map(date => {
      return {
        date,
        confirmed: confirmed[country][date],
        deaths: deaths[country][date],
        recovered: recovered[country][date]
      };
    });
  });

  const [countryIsoMap, countryGeoMap] = readCountriesGeojson(inputDir + path.sep + COUNTRIES_GEOJSON);
  const geojsonResults = createGeojson(countryIsoMap, countryGeoMap, jsonResults);

  if(!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputFilePath = outputDir + path.sep + "covid19_time_series.geojson";
  fs.writeFileSync(outputFilePath, JSON.stringify(geojsonResults, null, 2));
  console.log("File write successful: " + outputFilePath);
}

module.exports = update;
