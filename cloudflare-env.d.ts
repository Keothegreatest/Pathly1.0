declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    APP_URL?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    BUCKET?: R2Bucket;
  }
}

