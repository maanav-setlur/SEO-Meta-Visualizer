
import { db } from "./db";
import {
  analysisHistory,
  type HistoryItem,
  insertAnalysisHistorySchema
} from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  addToHistory(url: string, title: string | null): Promise<HistoryItem>;
  getHistory(): Promise<HistoryItem[]>;
  clearHistory(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async addToHistory(url: string, title: string | null): Promise<HistoryItem> {
    const [item] = await db
      .insert(analysisHistory)
      .values({ url, title })
      .returning();
    return item;
  }

  async getHistory(): Promise<HistoryItem[]> {
    return await db
      .select()
      .from(analysisHistory)
      .orderBy(desc(analysisHistory.createdAt))
      .limit(20);
  }

  async clearHistory(): Promise<void> {
    await db.delete(analysisHistory);
  }
}

export const storage = new DatabaseStorage();
