import { db } from "./db";
import { eq } from "drizzle-orm";
import { publications, type Publication, type InsertPublication } from "@shared/schema";

export const publicationStorage = {
  async getAll(): Promise<Publication[]> {
    return await db.select().from(publications);
  },

  async getById(id: number): Promise<Publication | undefined> {
    const result = await db.select().from(publications).where(eq(publications.id, id)).limit(1);
    return result[0];
  },

  async create(publication: InsertPublication): Promise<Publication> {
    const result = await db.insert(publications).values(publication).returning();
    return result[0];
  },

  async update(id: number, publication: Partial<InsertPublication>): Promise<Publication | undefined> {
    const result = await db
      .update(publications)
      .set({ ...publication, updatedAt: new Date() })
      .where(eq(publications.id, id))
      .returning();
    return result[0];
  },

  async delete(id: number): Promise<boolean> {
    const result = await db.delete(publications).where(eq(publications.id, id)).returning();
    return result.length > 0;
  }
};
