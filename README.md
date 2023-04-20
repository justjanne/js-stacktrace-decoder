# README

## Requirements

1. You'll need web-ext `npm-install -g web-ext`
2. Run `npm install` in the page subfolder

## Build

1. Run `npm run build` in the page subfolder
2. Run `web-ext build` in the addon subfolder

## Dependencies

- Facebook React
- Mozilla Source-Map

The [`lib/mappings.wasm`] file is vendored from Mozilla's Source-map project.

[`lib/mappings.wasm`]: https://github.com/mozilla/source-map/blob/56c1617f138ef016b90b936a037caef0a759ed4e/lib/mappings.wasm