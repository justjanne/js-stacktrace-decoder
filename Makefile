version_firefox         :=      $(shell jq '.version' -r addon-firefox/manifest.json)
version_chrome         :=      $(shell jq '.version' -r addon-chrome/manifest.json)

.PHONY: build
build: icons src
	wget https://github.com/mozilla/source-map/raw/56c1617f138ef016b90b936a037caef0a759ed4e/lib/mappings.wasm \
 		-O addon-firefox/lib/mappings.wasm
	wget https://github.com/mozilla/source-map/raw/56c1617f138ef016b90b936a037caef0a759ed4e/lib/mappings.wasm \
 		-O addon-chrome/lib/mappings.wasm
	cd page; yarn run build
	rsync -avH --delete page/dist/ addon-firefox/page
	rsync -avH --delete page/dist/ addon-chrome/page
	mkdir -p artifacts
	rm artifacts/addon-chrome-$(version_chrome).zip || true
	rm artifacts/addon-firefox-$(version_firefox).zip || true
	cd addon-chrome; zip -r9 ../artifacts/addon-chrome-$(version_chrome).zip *
	cd addon-firefox; zip -r9 ../artifacts/addon-firefox-$(version_firefox).zip *
.PHONY: src
src:
	mkdir -p artifacts
	rm artifacts/source-$(version_firefox).zip || true
	zip -r9 artifacts/source-$(version_firefox).zip $$(git ls-files)
.PHONY: icons
icons:
	inkscape addon-chrome/icons/stacktrace-decoder.svg --export-type=png --export-area-page --export-width=32 \
		-o addon-chrome/icons/stacktrace-decoder-32.png
	inkscape addon-chrome/icons/stacktrace-decoder.svg --export-type=png --export-area-page --export-width=48 \
		-o addon-chrome/icons/stacktrace-decoder-48.png
	inkscape addon-chrome/icons/stacktrace-decoder.svg --export-type=png --export-area-page --export-width=64 \
		-o addon-chrome/icons/stacktrace-decoder-64.png
	inkscape addon-chrome/icons/stacktrace-decoder.svg --export-type=png --export-area-page --export-width=96 \
		-o addon-chrome/icons/stacktrace-decoder-96.png
	inkscape addon-chrome/icons/stacktrace-decoder.svg --export-type=png --export-area-page --export-width=128 \
		-o addon-chrome/icons/stacktrace-decoder-128.png
	inkscape addon-chrome/icons/stacktrace-decoder.svg --export-type=png --export-area=x-16:y-16 --export-width=128 \
		-o addon-chrome/icons/stacktrace-decoder-128.png
