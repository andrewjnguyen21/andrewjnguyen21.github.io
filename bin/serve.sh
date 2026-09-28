#!/bin/bash
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export PATH="$DIR/vendor/fakebin:/Users/andynguyen/miniconda3/bin:$PATH"
export SDKROOT="$(xcrun --show-sdk-path)"
export GEM_HOME="$DIR/vendor/bundle"
export GEM_PATH="$DIR/vendor/bundle"
export BUNDLE_PATH="$DIR/vendor/bundle"
cd "$DIR"
exec ruby "$GEM_HOME/gems/bundler-2.4.22/exe/bundle" exec jekyll serve --host 0.0.0.0 --port 4000
