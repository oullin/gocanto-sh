/** Canonical origin for every absolute URL the profile site emits. */
export const SITE_URL = "https://gocanto.sh/";

/**
 * Canonical schema.org identifier for the Person entity.
 *
 * Every JSON-LD graph on the site must reference this exact `@id` so search
 * engines resolve one Person rather than several near-duplicates.
 */
export const PERSON_ID = `${SITE_URL}#person`;
