/** A normalized writing post exposed to the site, search, and RSS feed. */
export interface Post {
    title: string;
    url: string;
    canonicalUrl: string;
    date: {
        raw: string;
        display: string;
        short: string;
        year: string;
    };
    modifiedAt: string;
    image: string;
    readingTime: string;
    description: string;
    tags: string[];
}
