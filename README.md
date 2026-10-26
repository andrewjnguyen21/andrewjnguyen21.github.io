# Andy Nguyen's personal website

A Jekyll portfolio in Michigan navy and maize. The home page brings together research, engineering projects, publications, and education.

## Local preview

Use Ruby 3.3 and Bundler, then run:

```sh
bundle install
bundle exec jekyll serve --host 127.0.0.1 --port 4000
```

On this Mac, the configured launcher is `./scripts/preview.sh`.

Open <http://127.0.0.1:4000>. The `/projects/` and `/research/` routes also remain available.

## Updating content

- `_data/work.yml` contains the projects and their related publications. The project and publication sections use the same records, so titles, statuses, and links stay consistent.
- `_includes/sections/author.html` contains the introduction, portrait, and header education.
- `_includes/sections/education.html` contains the education details shown beside the portrait. Experience is not displayed.
- `assets/css/style.scss` contains the layout and original navy/maize color palette.

Confirmed publications use `publication_year` in `_data/work.yml` and are grouped newest year first. Preprints and manuscripts without a confirmed publication year appear under “Preprints, under review & in preparation.”

Publication links point to the corresponding publication entry. “See project” opens the matching project's contribution details. The MIT Table Tennis Robot V2 appears as a research project while its related manuscript remains in preparation. Manuscripts in preparation remain distinct from published or under-review work.

## Demo media

Poster images live in `assets/images/projects/`, and compact MP4 demos live in `assets/videos/`. Demos play automatically when visible, pause offscreen, and honor reduced-motion preferences. A footer control pauses or resumes all animations. The original GIFs are preserved.

To generate missing MP4 files from their GIF sources, install FFmpeg and run:

```sh
python3 scripts/prepare-media.py
```
