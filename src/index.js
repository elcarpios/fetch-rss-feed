const fs = require('fs');
const Parser = require('rss-parser');

module.exports = (feeds, path) => {
	const parser = new Parser();
	return Promise.all(feeds.map(feed => parser.parseURL(feed)))
		.then(feedings => JSON.stringify(feedings, null, 2) , 'utf-8')
		.catch(error => `It has been an error fetching the feeds: ${error}`)
		.then(response => {
			if (!!path) {
				fs.writeFileSync(path);
			} else {
				return response;
			}
		});
};
