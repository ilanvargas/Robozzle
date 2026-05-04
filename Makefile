TEST_BINARIES := $(wildcard ./test/*.js)

all: build

build:
	npx tsc -p tsconfig.json

test: build
	npx tsx dist/test/robot_test.js
	@echo "--- Exécution test jester ---"
	npx jest --coverage -c jest.config.ts

eslint:
	npx eslint --fix src/ test/

serve:
	npx parcel serve src/index.html

run: 
	npx tsx dist/test/main_test.js

clean:
	rm -rf dist/*

.PHONY: build test eslint serve clean
