test:
	@find test/test-*.js | xargs -n 1 -t node

doc:
	node doc/make.js

.PHONY: test doc