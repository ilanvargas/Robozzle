TEST_BINARIES := $(wildcard ./test/*.ts)

build:
	npx tsc

test:
	@echo "--- Exécution de tous les tests ---"
	@for test_exec in $(TEST_BINARIES); do \
		echo "=> Exécution de $$test_exec"; \
		npx jest $$test_exec; \
		echo ""; \
	done
	@echo "--- Tous les tests sont terminés ---"

eslint:
	npx eslint src/ 

serve:
	npx parcel serve src/index.html


