import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ cacheDir: '/Users/god/Downloads/Mandi-Store/tina/__generated__/.cache/1767110229046', url: 'https://content.tinajs.io/1.6/content/mock/github/main', token: 'mock', queries,  });
export default client;
  