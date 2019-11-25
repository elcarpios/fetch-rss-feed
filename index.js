const fs = require('fs');
const path = require('path');
const mkdir = require('mkdirp');
const normalize = require('normalize-strings');
const { kebabCase } = require('case-anything');
const Parser = require('rss-parser');

const indexOutput = [];
const errorOutput = [];

let pathBase;

const ENCODE = 'utf-8'
	PARSER = new Parser();

const stringify = content => JSON.stringify(content, null, 2);

const fetchFeed = (feedUrl) => {
	return PARSER.parseURL(feedUrl)
		.then(feed => {
			const feedName = kebabCase(normalize(feed.title));
			const singlePath = path.join(pathBase, `resources/${feedName}`);

			mkdir.sync(singlePath);			
			indexOutput.push({ name: feedName });
			fs.writeFileSync(path.join(singlePath, 'index.json'), stringify(feed), ENCODE);
		})
		.catch(error => {
			errorOutput.push(error);
		});
};

module.exports = (feeds, targetPath) => {
	pathBase = path.join(__dirname, targetPath);
	mkdir.sync(pathBase);
	
	Promise.all(feeds.map(fetchFeed))
		.then(() => { 
			if (errorOutput.length > 0) {
				const errorPath = path.join(pathBase, `logs`);

				mkdir.sync(errorPath);
				fs.writeFileSync(path.join(errorPath, `${Date.now().toString()}.json`), stringify(errorOutput), ENCODE);
			}

			fs.writeFileSync(path.join(pathBase, 'index.json'), stringify(indexOutput), ENCODE); 
		});
};