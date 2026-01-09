import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, serial, timestamp, json, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (for authentication)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Team Members table
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  image: text("image").notNull(),
  bio: text("bio").notNull(),
  social: json("social").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

// Publications table
export const publications = pgTable("publications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  journal: text("journal").notNull(),
  year: text("year").notNull(),
  authors: text("authors").array().notNull().default(sql`'{}'::text[]`),
  type: text("type").notNull(),
  tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
  abstract: text("abstract").notNull(),
  doi: text("doi").notNull(),
  linkUrl: text("link_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPublicationSchema = createInsertSchema(publications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPublication = z.infer<typeof insertPublicationSchema>;
export type Publication = typeof publications.$inferSelect;

// Gallery Items table
export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  src: text("src").notNull(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertGalleryItemSchema = createInsertSchema(galleryItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertGalleryItem = z.infer<typeof insertGalleryItemSchema>;
export type GalleryItem = typeof galleryItems.$inferSelect;

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  sender: text("sender").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  date: text("date").notNull(),
  status: text("status").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Private Gallery Items table (admin only)
export const privateGalleryItems = pgTable("private_gallery_items", {
  id: serial("id").primaryKey(),
  src: text("src").notNull(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  year: text("year").notNull(),
  description: text("description").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPrivateGalleryItemSchema = createInsertSchema(privateGalleryItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPrivateGalleryItem = z.infer<typeof insertPrivateGalleryItemSchema>;
export type PrivateGalleryItem = typeof privateGalleryItems.$inferSelect;

// Project table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  fullDescription: text("fulldescription").notNull().default(""),
  sections: jsonb("sections").notNull().default([]), // Array of { content: string, image?: string }
  tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
  image: text("image").notNull(),
  status: text("status").notNull(), // 'Ongoing' or 'Completed'
  year: text("year").notNull(),
  impact: text("impact").notNull().default(""),
  paperUrl: text("paperurl"),
  paperDetails: jsonb("paperdetails"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectCategories = pgTable("project_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const insertProjectCategorySchema = createInsertSchema(projectCategories).omit({
  id: true,
});

export type ProjectCategory = typeof projectCategories.$inferSelect;
export type InsertProjectCategory = z.infer<typeof insertProjectCategorySchema>;

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Research Topics table
export const researchTopics = pgTable("research_topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  year: integer("year").notNull(),
  description: text("description").notNull(), // Summary Description (max 30 words)
  image: text("image").notNull(), // Title Image
  abstract: text("abstract").notNull(),
  authors: jsonb("authors").notNull().default([]), // Array of { name: string, image?: string }
  doi: text("doi"),
  journal: text("journal"),
  sections: jsonb("sections").notNull().default([]), // Array of { title: string, content: string, image?: string }
  relatedPublicationIds: integer("related_publication_ids").array().notNull().default(sql`'{}'::integer[]`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertResearchTopicSchema = createInsertSchema(researchTopics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
