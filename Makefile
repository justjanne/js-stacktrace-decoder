.PHONY: build
build:
	cd page; yarn run build
	cd addon; web-ext build --overwrite-dest
