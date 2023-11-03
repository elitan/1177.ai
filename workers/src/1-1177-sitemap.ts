import * as cheerio from "cheerio";
import axios from "axios";
import { db } from "./utils/db";

const NON_SWEDISH = [
  "/ru-ru",
  "/fi-fi",
  "/sma-se",
  "/smj-se",
  "/fit",
  "/sv-se-x-ll",
  "/ti-er",
  "/en",
  "/uk",
  "/se-se",
  "/ar-sy",
  "/fa",
  "/so-so",
  "/sdh",
  "/prs-af",
  "/ps",
  "/swl",
  "/pl-pl",
];

async function main() {
  for (let i = 0; i < 40; i++) {
    const n = i.toString().padStart(2, "0");
    const url = `https://www.1177.se/${n}sitemap.xml`;

    const response = await axios.get(url, {
      validateStatus: () => true,
    });

    if (response.status !== 200) {
      console.log("not 200");
      // update db
      continue;
    }

    // Load the XML response into Cheerio
    const $ = cheerio.load(response.data, {});

    // Iterate over each <loc> element and extract the URL path
    // @ts-ignore
    $("url loc").each(async (_i, element) => {
      const url = new URL($(element).text());

      if (NON_SWEDISH.some((path) => url.pathname.startsWith(path))) {
        return;
      }

      try {
        await db
          .insertInto("domainPaths")
          .values({
            domainId: 1,
            path: url.pathname,
            depth: -1,
          })
          .execute();
      } catch (e) {
        console.error(e);
      }
    });
  }
}

main();
