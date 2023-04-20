.PHONY: build
build:
	cd page; yarn run build
	cd addon; web-ext build
.PHONY: src
src:
	 zip -r9 stacktrace-decoder.zip $(git ls-files)

