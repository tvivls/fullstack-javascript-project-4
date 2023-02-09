install:
	npm ci
publish:
	npm publish --dry-run
lint:
	npx eslint .
page-loader:
	bin/page-loader.js
test:
	npx jest
test-coverage:
	npx jest --coverage