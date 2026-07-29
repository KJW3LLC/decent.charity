# decent.charity

A Jekyll site that publishes sourced profiles of charitable organizations and practical ways to contribute time, talents, treasure, or needed goods.

## Local Development

```bash
npm install
bundle install
bundle exec jekyll serve
```

## Content Generation

Generated articles use the NVIDIA API through `scripts/generate-guide.js` and draw from `topics.json`.

The generator is configured to:

- Write from a welcoming Judeo-Christian perspective
- Use NIV as the Scripture reference basis
- Prefer Scripture references and short excerpts over long quotations
- Avoid emojis in article content
- Include reflection questions, weekly practice, prayer, and takeaways

Set `NVIDIA_API_KEY` before running:

```bash
npm run generate
```
