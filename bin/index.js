#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const fetcher = require('../index');

const ENCODING = 'utf-8';
const [ feedingPath, basePath ] = process.argv.slice(2);

const feeds = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../${feedingPath}`), ENCODING), null, 2);

fetcher(feeds, basePath);
