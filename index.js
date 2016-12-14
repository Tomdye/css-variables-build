const postcss = require('postcss');
const cssvariables = require('postcss-css-variables');
const cssmodules = require('postcss-modules');
const cssnested = require('postcss-nested');

const fs = require('fs');

const mycss = fs.readFileSync('./css/main.css', 'utf8');
const themes = [
	'./theme/blue.css',
	'./theme/green.css'
];

themes.forEach((themeLocation) => {
	const theme = fs.readFileSync(themeLocation, 'utf8');
	const parsedTheme = postcss.parse(theme);

	if ( parsedTheme.nodes.length !== 1) {
		throw new Error('wrong number of rules');
	}

	const themeSelectorNode = parsedTheme.nodes[0];
	const themeSelector = themeSelectorNode.selector;
	const themeVariables = {};

	themeSelectorNode.nodes.forEach(({ prop, value }) => {
		if (prop && value) {
			themeVariables[prop] = value;
		} else {
			throw new Error('prop and value not present');
		}
	});

	const themeWrappedCss = `${themeSelector} {
	${mycss}
}`;

	const output = postcss([
		cssnested(),
		cssvariables({
			variables: themeVariables
		})
	])
	.process(themeWrappedCss)
	.css;

	console.log(`${themeLocation} output:

${output}
	`);

})
