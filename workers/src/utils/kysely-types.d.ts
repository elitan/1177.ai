import type { ColumnType } from "kysely";

export type CrawlStatus = "CRAWLING" | "CRAWLING_COMPLETED" | "WAITING_TO_BE_CRAWLED";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface DomainPaths {
  crawlStatus: Generated<CrawlStatus | null>;
  createdAt: Generated<Timestamp>;
  depth: number;
  domainId: number | null;
  id: Generated<number>;
  metaDescription: string | null;
  metaTitle: string | null;
  path: string;
  statusCode: number | null;
  updatedAt: Generated<Timestamp>;
  visitedAt: Timestamp | null;
}

export interface Domains {
  createdAt: Generated<Timestamp>;
  domain: string | null;
  highestCrawlAfter: Generated<number>;
  id: Generated<number>;
  maxDepth: Generated<number>;
  scheme: Generated<string>;
  subdomain: string | null;
  updatedAt: Generated<Timestamp>;
  visitedAt: Timestamp | null;
}

export interface EmbeddingChunks {
  chunkText: string;
  createdAt: Generated<Timestamp>;
  domainPathId: number | null;
  embedding: string | null;
  id: Generated<number>;
}

export interface DB {
  domainPaths: DomainPaths;
  domains: Domains;
  embeddingChunks: EmbeddingChunks;
}
