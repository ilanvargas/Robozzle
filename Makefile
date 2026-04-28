TEST_BINARIES := $(wildcard ./test/*.js)

build:
	npx tsc -p tsconfig.json

test:
	@echo "--- Exécution de tous les tests ---"
	npx jest --coverage
	@echo "--- Tous les tests sont terminés ---"

eslint:
	npx eslint --fix src/ test/

serve:
	npx parcel serve src/index.html

run: 
	npx tsx dist/test/board.test.js

clean:
	rm -rf dist/*

.PHONY: build test eslint serve clean
