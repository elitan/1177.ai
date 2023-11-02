import * as cheerio from "cheerio";
import axios from "axios";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { db } from "./utils/db";
import { generateEmbedding } from "./utils";

async function main() {
  console.log("hello world 123123");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 3000,
    chunkOverlap: 0,
  });

  const paths = await db
    .selectFrom("domainPaths as dp")
    .innerJoin("domains as d", "d.id", "dp.domainId")
    .select(["dp.id", "dp.path", "d.scheme", "d.domain", "crawlStatus"])
    .where("crawlStatus", "=", "WAITING_TO_BE_CRAWLED")
    .execute();

  console.log({ paths });

  for (const path of paths) {
    console.log({ path });

    const url = `${path.scheme}://${path.domain}${path.path}`;

    const response = await axios.get(url, {
      validateStatus: () => true,
    });

    // TODO: insert new paths to db

    if (response.status !== 200) {
      console.log("not 200");
      // update db
      continue;
    }

    const $ = cheerio.load(response.data);

    const textContent = $(".columns.medium-offset-2.medium-8.large-6")
      .text()
      .trim();

    if (!textContent) {
      console.log("no text content");
      // update db
      continue;
    }

    const output = await splitter.createDocuments([textContent]);

    console.log(output[0].pageContent);
    console.log(output[0].metadata);

    const openAiEmbeddingResponse = await generateEmbedding(
      output[0].pageContent
    );

    console.log(openAiEmbeddingResponse.data);

    const embedding = openAiEmbeddingResponse.data[0].embedding;

    console.log(embedding);

    await db
      .insertInto("embeddingChunks")
      .values({
        chunkText: output[0].pageContent,
        embedding: `[${embedding.toString()}]`,
        domainPathId: path.id,
      })
      .execute();

    process.exit(0);
    // get data
    // generate embeddings
    // save in db
  }

  console.log("hello world 123123");
  process.exit(0);
}

main();
