#!/bin/sh
# Launch the same Jekyll site used by GitHub Pages, with a working local Ruby.
set -eu
cd "$(dirname "$0")/.."
if [ -x /usr/local/opt/ruby@3.3/bin/bundle ]; then
  exec env -u GEM_HOME -u GEM_PATH PATH="/usr/local/opt/ruby@3.3/bin:$PATH" BUNDLE_PATH=vendor/bundle /usr/local/opt/ruby@3.3/bin/bundle exec jekyll serve --host 127.0.0.1 --port 4000
fi
exec bundle exec jekyll serve --host 127.0.0.1 --port 4000
