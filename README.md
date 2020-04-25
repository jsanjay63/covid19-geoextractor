# Covid 19 - GeoExtractor
GeoFormats like Geojson time-series of Coronavirus cases (confirmed, deaths and recovered) per country - updated daily

Transforms the data from [CSSEGISandData/COVID-19](https://github.com/CSSEGISandData/COVID-19) into a GeoFormat datasets like Geojson file. Available at [https://jsanjay63.github.io/covid19-geoextractor/output/covid19_time_series.geojson](https://jsanjay63.github.io/covid19-geoextractor/output/covid19_time_series.geojson). Updated every 2 hours using GitHub Actions.

The Geojson contains the number of Coronavirus confirmed cases, deaths, and recovered cases for every country and every day since 2020-1-22:

```
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "id": "Afghanistan",
    "properties": {
      "iso": "AFG",
      "name": "Afghanistan",
      "dates": {
        "2020-1-22": {
          "confirmed": 0,
          "recovered": 0,
          "deaths": 0
        },
        "2020-1-23": {
          "confirmed": 0,
          "recovered": 0,
          "deaths": 0
        },
        ...
      },
      "current_confirmed": 1279,
      "current_recovered": 179,
      "current_deaths": 42
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [61.210817, 35.650072],
          [62.230651,35.270664],
          ...
        ]
      ]
    }
  ],
  ...
}
```

### Project Ideation
Credits: https://github.com/pomber/covid19, https://github.com/CSSEGISandData/COVID-19

### Projects using this dataset ([+ add yours])

#### Visualizations
- [Covid 19 Cases to Population Ratio](https://studio.here.com/viewer/?project_id=fc72e094-6ade-4c2f-8e9c-ecf902b36709)

## License

The code from this repo is MIT licensed.  
The data is under [CSSEGISandData/COVID-19](https://github.com/CSSEGISandData/COVID-19/) terms of use.
