TEST_BINARIES := $(wildcard ./test/*.js)

build:
	npx tsc

test:
	@echo "--- Exécution de tous les tests ---"
	npx jest
	@echo "--- Tous les tests sont terminés ---"

eslint:
	npx eslint --fix src/ test/

serve:
	npx parcel serve src/index.html

clean:
	rm -rf dist/*

.PHONY: build test eslint serve clean
