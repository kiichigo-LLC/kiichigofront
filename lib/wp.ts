export { SITE_NAME, SITE, THEME, WP, WP_CLIENT, asset, path, canonical } from "utils/config";

export const FORM_CHECK_URL =
  process.env.NEXT_PUBLIC_FORM_CHECK_URL ||
  "https://wp.kiichigo.work/form/check.php";
export const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
  "6LdQSDIaAAAAAAkqYuSdqvkMmY0JtKB5fwjDUvJ4";

export {
  PORTFOLIO_TAG_ID,
  decodeHtmlEntities,
  strip,
  wpPath,
  hasPortfolioTag,
  metaStr,
  trajDate,
  extractYoutubeId,
} from "@/lib/wp-utils";
