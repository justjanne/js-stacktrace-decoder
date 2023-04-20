.PHONY: build
build:
	wget https://github.com/mozilla/source-map/raw/56c1617f138ef016b90b936a037caef0a759ed4e/lib/mappings.wasm \
 		-O addon/lib/mappings.wasm
	cd page; yarn run build
.PHONY: package
package: build
	cd addon; web-ext build
.PHONY: src
src:
	 zip -r9 stacktrace-decoder.zip $(git ls-files)

