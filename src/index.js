const fs = require('fs');
const path = require('path');
const Transform = require('stream').Transform;

const stream = fs.createReadStream(path.resolve(__dirname, 'cities15000.txt'));
const result = fs.createWriteStream(path.resolve(__dirname, '../dist/result.json'));

/**
 * Min population to filter
 * @type {number}
 */
const POPULATION_LIMIT = 5000000;
/**
 * Array of country codes, e.g.: ['DE', 'NL']
 * @type {Array}
 */
const allowedCountryCodes = [];
let cityToBeAdded = null;

let cityCount = 0;
let linesCount = 0;
let tempLine = null;

const lineSplitter = new Transform({
    transform(chunk, encoding, callback) {
        const lines = chunk.toString().split('\n');
        const lastLine = lines[lines.length - 1];

        if (tempLine !== null) {
            lines[0] = tempLine + lines[0];
            tempLine = null;
        }

        if (typeof lastLine[lastLine.length - 1] !== 'number') {
            tempLine = lines.pop();
        }

        lines.forEach((line) => {
            this.push(line);
            linesCount++;
        });
        callback();
    }
});

const cityMapper = new Transform({
    transform(chunk, encoding, callback) {
        const line = chunk.toString();
        const fields = line.split('\t');

        const city = {
            id: parseInt(fields[0], 10),
            name: fields[1],
            asciiname: fields[2],
            lat: fields[4],
            lng: fields[5],
            countryCode: fields[8],
            population: parseInt(fields[14], 10),
            elevation: parseInt(fields[15], 10) || null,
            timeZone: fields[16]
        };

        this.push(JSON.stringify(city));
        callback();
    }
});

const populationLimit = new Transform({
    transform(chunk, encoding, callback) {
        const city = JSON.parse(chunk.toString());
        if (city.population < POPULATION_LIMIT) {
            callback();
            return;
        }
        this.push(JSON.stringify(city));
        callback();
    }
});

const countryLimit = new Transform({
    transform(chunk, encoding, callback) {
        const city = JSON.parse(chunk.toString());
        if (allowedCountryCodes.length > 0 && allowedCountryCodes.includes(city.countryCode) === false) {
            callback();
            return;
        }

        this.push(JSON.stringify(city));
        callback();
    }
});

const jsonNormilizer = new Transform({
    transform(chunk, encoding, callback) {
        const city = JSON.parse(chunk.toString());

        cityCount++;
        if (cityToBeAdded === null) {
            cityToBeAdded = JSON.stringify(city);
        } else {
            this.push('  ' + cityToBeAdded + ',\n');
            cityToBeAdded = JSON.stringify(city)
        }

        callback();
    }
});

console.time('Cities script');
result.write('[\n');
stream
    .on('error', (err) => {
        console.error('Error on reading the file:\n', err);
    })
    .pipe(lineSplitter)
    .pipe(cityMapper)
    .pipe(populationLimit)
    .pipe(countryLimit)
    .pipe(jsonNormilizer)
    .on('end', () => {
        result.write('  ' + cityToBeAdded + '\n]\n')
    })
    .pipe(result)
    .on('error', (err) => {
        console.error('Error on writing the file:\n', err);
    })
    .on('finish', () => {
        console.log('>>> Finised <<<');
        console.timeEnd('Cities script');
        console.log('Number of cities matched the conditions:', cityCount);
        console.log('Total number of cities:', linesCount);
    });
