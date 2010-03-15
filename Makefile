fab:
	@node ./make.js

test:
	@find test/test-*.js | xargs -n 1 -t node

.PHONY: test fab