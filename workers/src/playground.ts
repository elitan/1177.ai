import { sql } from "kysely";
import { generateEmbedding } from "./utils";
import { db } from "./utils/db";

async function main() {
  const query = "Jag har en gaffel i ögat, vad bör jag göra?";

  const queryEmbedding = await generateEmbedding(query);

  console.log({ queryEmbedding });

  const { embedding } = queryEmbedding.data[0];

  console.log(embedding.toString());

  const raw = db
    .selectFrom("embeddingChunks")
    .select(["id", "domainPathId"])
    .orderBy(sql`embedding::VECTOR <=> '[${embedding.toString()}]'`)
    .limit(5);

  const c = raw.compile();

  console.log({ c });

  const res = await raw.execute();

  console.log({ res });
}

main();
