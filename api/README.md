# decent.charity API Documentation

The static JSON API provides programmatic access to sourced charity profiles, categories, topics, feeds, and site metadata.

## Endpoints

### Charity Profiles
**Endpoint:** `/api/guides.json`

Returns every published profile with its title, organization, category, official source, tags, estimated reading time, image, and content length.

### Topics
**Endpoint:** `/api/topics.json`

Returns article tags and the articles associated with each topic.

### Site Index
**Endpoint:** `/index.json`

Returns high-level site metadata, statistics, endpoint links, and navigation.

### Feed
**Endpoint:** `/feed.xml`

Standard RSS/Atom feed of latest articles.

## Content Notes

Profiles are generated from `topics.json`. Every topic requires an official organization source, and the generator fetches that source before writing. Content covers the organization’s background, communities served, programs, and ways to contribute time, talents, treasure, or needed goods.

## Attribution

When reusing content, credit "decent.charity" and link to the original article URL.

Example citation:

`[Article Title], decent.charity (https://decent.charity/guides/[article-slug]/)`
