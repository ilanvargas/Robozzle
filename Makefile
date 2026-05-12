TEST_BINARIES := $(wildcard ./test/*.js)

all: build

build:
	npx tsc -p tsconfig.json

test: 
	npx jest --coverage -c jest.config.ts

setup:
	mkdir -p public
	cp share/puzzles.json public/puzzles.json

eslint:
	npx eslint --fix src/ test/

serve:
	npx parcel serve src/index.html

run: 
	npx tsx dist/test/robot_test.js

clean:
	rm -rf dist/*

.PHONY: all build test eslint serve clean
