# Node world cities
A small starter script helping to pipe your handlers together to filter world's cities by given parameters.

* Node.js > 6.9
* No external dependencies

## How to start
```bash
npm start
```

## How to change parameters
Inside index.js there are 2 parameters by default:

* `POPULATION_LIMIT` _integer_ minimal population
* `allowedCountryCodes` _array_ of country codes

## Database
The database is taken from [geonames.org](http://www.geonames.org).
The source file `cities15000.txt` contains cities with population more than 15000.
Fields in that file, which used as an array in index.js are:

| #   | Name              | Description                               |
|-----|-------------------|-------------------------------------------|
| 0:  | geonameid         | integer id of record in geonames database |
| 1:  | name              | name of geographical point (utf8) varchar(200) |
| 2:  | asciiname         | name of geographical point in plain ascii characters, varchar(200) |
| 3:  | alternatenames    | alternatenames, comma separated, ascii names automatically transliterated, convenience attribute from alternatename table, varchar(10000) |
| 4:  | latitude          | latitude in decimal degrees (wgs84) |
| 5:  | longitude         | longitude in decimal degrees (wgs84) |
| 6:  | feature class     | see http://www.geonames.org/export/codes.html, char(1) |
| 7:  | feature code      | see http://www.geonames.org/export/codes.html, varchar(10) |
| 8:  | country code      | ISO-3166 2-letter country code, 2 characters |
| 9:  | cc2               | alternate country codes, comma separated, ISO-3166 2-letter country code, 200 characters |
| 10: | admin1 code       | fipscode (subject to change to iso code), see exceptions below, see file admin1Codes.txt for display names of this code; varchar(20) |
| 11: | admin2 code       | code for the second administrative division, a county in the US, see file admin2Codes.txt; varchar(80) |
| 12: | admin3 code       | code for third level administrative division, varchar(20) |
| 13: | admin4 code       | code for fourth level administrative division, varchar(20) |
| 14: | population        | bigint (8 byte int) |
| 15: | elevation         | in meters, integer |
| 16: | dem               | digital elevation model, srtm3 or gtopo30, average elevation of 3''x3'' (ca 90mx90m) or 30''x30'' (ca 900mx900m) area in meters, integer. srtm processed by cgiar/ciat. |
| 17: | timezone          | the iana timezone id (see file timeZone.txt) varchar(40) |
| 18: | modification date | date of last modification in yyyy-MM-dd format |