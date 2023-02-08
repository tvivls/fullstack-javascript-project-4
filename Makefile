install:
	npm ci
publish:
	npm publish --dry-run
lint:
	npx eslint .
page-loader:
	bin/page-loader.js