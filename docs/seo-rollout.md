# SEO rollout and measurement

The build enforces technical SEO locally. Search Console verification, URL inspection, and post-launch query analysis still require access to the production Google property.

## Before deployment

Record the date and export a baseline from the `gocanto.sh` Search Console domain property:

- indexed and excluded page counts;
- branded and non-branded impressions, clicks, click-through rate, and average position;
- top landing pages and queries for each hostname;
- mobile and desktop Core Web Vitals.

Store exports outside the repository when they contain account or visitor data.

## After deployment

1. Submit `https://gocanto.sh/sitemap.xml` and `https://writing.gocanto.sh/sitemap.xml` to the same domain property.
2. Inspect `/`, `/resume`, all three `/expertise/*` routes, the writing index, and every article URL.
3. Request indexing only after URL Inspection reports the intended self-canonical and crawlable HTML.
4. Validate the profile, resume, one expertise page, and one article with Google's Rich Results Test.
5. Confirm that raw Markdown and both `llms.txt` endpoints return `200` with `X-Robots-Tag: noindex, follow`.

## Analytics signals

Vercel Analytics and Speed Insights run on both hostnames. Automatic page views cover profile, expertise, resume, writing-index, and article visits. Explicit conversion events use:

- `profile_conversion` with targets such as `contact-cta`, `writing-index`, and `writing-transition`;
- `writing_transition` with targets such as `profile-transition`, `resume-transition`, `expertise-transition`, and `rss-subscribe`.

Review transitions by target rather than treating all outbound clicks as the same intent. `/resume` page views are the resume signal.

## Review cadence

At 4, 8, and 12 weeks, compare against the baseline and annotate deployed title or internal-link changes. Prioritise real Search Console queries with meaningful impressions. Change titles only where the query intent and page proof align, and strengthen descriptive links before creating new hub pages. A topic hub should wait until its cluster contains at least three substantive articles.
