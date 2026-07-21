/** A normalized writing post exposed to the site, search, and RSS feed. */
export interface Post {
    title: string;
    url: string;
    date: {
        raw: string;
        display: string;
        short: string;
        year: string;
    };
    readingTime: string;
    description: string;
    tags: string[];
}
