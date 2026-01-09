import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import { 
  users, 
  teamMembers, 
  publications, 
  galleryItems, 
  messages, 
  privateGalleryItems, 
  projects, 
  projectCategories, 
  researchTopics, 
  type User, 
  type InsertUser, 
  type TeamMember, 
  type InsertTeamMember, 
  type Publication, 
  type InsertPublication, 
  type GalleryItem, 
  type InsertGalleryItem, 
  type Message, 
  type InsertMessage, 
  type PrivateGalleryItem, 
  type InsertPrivateGalleryItem, 
  type Project, 
  type InsertProject, 
  type ProjectCategory, 
  type InsertProjectCategory
} from "@shared/schema";
import { publicationStorage } from "./publications_storage";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<any>;
  getUserByUsername(username: string): Promise<any>;
  createUser(user: any): Promise<any>;

  // Team Member methods
  getAllTeamMembers(): Promise<TeamMember[]>;
  getTeamMember(id: number): Promise<TeamMember | undefined>;
  createTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, teamMember: Partial<InsertTeamMember>): Promise<TeamMember | undefined>;
  deleteTeamMember(id: number): Promise<boolean>;

  // Publication methods
  getAllPublications(): Promise<Publication[]>;
  getPublication(id: number): Promise<Publication | undefined>;
  createPublication(publication: InsertPublication): Promise<Publication>;
  updatePublication(id: number, publication: Partial<InsertPublication>): Promise<Publication | undefined>;
  deletePublication(id: number): Promise<boolean>;

  // Gallery Item methods
  getAllGalleryItems(): Promise<GalleryItem[]>;
  getGalleryItem(id: number): Promise<GalleryItem | undefined>;
  createGalleryItem(galleryItem: InsertGalleryItem): Promise<GalleryItem>;
  updateGalleryItem(id: number, galleryItem: Partial<InsertGalleryItem>): Promise<GalleryItem | undefined>;
  deleteGalleryItem(id: number): Promise<boolean>;

  // Message methods
  getAllMessages(): Promise<Message[]>;
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(id: number, message: Partial<InsertMessage>): Promise<Message | undefined>;
  deleteMessage(id: number): Promise<boolean>;

  // Research Topic methods
  getAllResearchTopics(): Promise<any[]>;
  getResearchTopic(id: number): Promise<any | undefined>;
  createResearchTopic(researchTopic: any): Promise<any>;
  updateResearchTopic(id: number, researchTopic: Partial<any>): Promise<any | undefined>;
  deleteResearchTopic(id: number): Promise<boolean>;

  // Private Gallery Item methods
  getAllPrivateGalleryItems(): Promise<PrivateGalleryItem[]>;
  getPrivateGalleryItem(id: number): Promise<PrivateGalleryItem | undefined>;
  createPrivateGalleryItem(item: InsertPrivateGalleryItem): Promise<PrivateGalleryItem>;
  updatePrivateGalleryItem(id: number, item: Partial<InsertPrivateGalleryItem>): Promise<PrivateGalleryItem | undefined>;
  deletePrivateGalleryItem(id: number): Promise<boolean>;

  // Project methods
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Project Category methods
  getAllProjectCategories(): Promise<ProjectCategory[]>;
  createProjectCategory(category: InsertProjectCategory): Promise<ProjectCategory>;
  deleteProjectCategory(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<any> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<any> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: any): Promise<any> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Team Member methods
  async getAllTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers);
  }

  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    const result = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1);
    return result[0];
  }

  async createTeamMember(teamMember: InsertTeamMember): Promise<TeamMember> {
    const result = await db.insert(teamMembers).values(teamMember).returning();
    return result[0];
  }

  async updateTeamMember(id: number, teamMember: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    const result = await db
      .update(teamMembers)
      .set({ ...teamMember, updatedAt: new Date() })
      .where(eq(teamMembers.id, id))
      .returning();
    return result[0];
  }

  async deleteTeamMember(id: number): Promise<boolean> {
    const result = await db.delete(teamMembers).where(eq(teamMembers.id, id)).returning();
    return result.length > 0;
  }

  // Publication methods
  async getAllPublications(): Promise<Publication[]> {
    return await publicationStorage.getAll();
  }

  async getPublication(id: number): Promise<Publication | undefined> {
    return await publicationStorage.getById(id);
  }

  async createPublication(publication: InsertPublication): Promise<Publication> {
    return await publicationStorage.create(publication);
  }

  async updatePublication(id: number, publication: Partial<InsertPublication>): Promise<Publication | undefined> {
    return await publicationStorage.update(id, publication);
  }

  async deletePublication(id: number): Promise<boolean> {
    return await publicationStorage.delete(id);
  }

  // Gallery Item methods
  async getAllGalleryItems(): Promise<GalleryItem[]> {
    return await db.select().from(galleryItems);
  }

  async getGalleryItem(id: number): Promise<GalleryItem | undefined> {
    const result = await db.select().from(galleryItems).where(eq(galleryItems.id, id)).limit(1);
    return result[0];
  }

  async createGalleryItem(galleryItem: InsertGalleryItem): Promise<GalleryItem> {
    const result = await db.insert(galleryItems).values(galleryItem).returning();
    return result[0];
  }

  async updateGalleryItem(id: number, galleryItem: Partial<InsertGalleryItem>): Promise<GalleryItem | undefined> {
    const result = await db
      .update(galleryItems)
      .set({ ...galleryItem, updatedAt: new Date() })
      .where(eq(galleryItems.id, id))
      .returning();
    return result[0];
  }

  async deleteGalleryItem(id: number): Promise<boolean> {
    const result = await db.delete(galleryItems).where(eq(galleryItems.id, id)).returning();
    return result.length > 0;
  }

  // Message methods
  async getAllMessages(): Promise<Message[]> {
    return await db.select().from(messages);
  }

  async getMessage(id: number): Promise<Message | undefined> {
    const result = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
    return result[0];
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }

  async updateMessage(id: number, message: Partial<InsertMessage>): Promise<Message | undefined> {
    const result = await db
      .update(messages)
      .set({ ...message, updatedAt: new Date() })
      .where(eq(messages.id, id))
      .returning();
    return result[0];
  }

  async deleteMessage(id: number): Promise<boolean> {
    const result = await db.delete(messages).where(eq(messages.id, id)).returning();
    return result.length > 0;
  }

  // Research Topic methods
  async getAllResearchTopics(): Promise<any[]> {
    return await db.select().from(researchTopics).orderBy(sql`${researchTopics.updatedAt} DESC`);
  }

  async getResearchTopic(id: number): Promise<any | undefined> {
    const result = await db.select().from(researchTopics).where(eq(researchTopics.id, id)).limit(1);
    return result[0];
  }

  async createResearchTopic(researchTopic: any): Promise<any> {
    const result = await db.insert(researchTopics).values(researchTopic).returning();
    return result[0];
  }

  async updateResearchTopic(id: number, researchTopic: Partial<any>): Promise<any | undefined> {
    const result = await db
      .update(researchTopics)
      .set({ ...researchTopic, updatedAt: new Date() })
      .where(eq(researchTopics.id, id))
      .returning();
    return result[0];
  }

  async deleteResearchTopic(id: number): Promise<boolean> {
    const result = await db.delete(researchTopics).where(eq(researchTopics.id, id)).returning();
    return result.length > 0;
  }

  // Private Gallery Item methods
  async getAllPrivateGalleryItems(): Promise<PrivateGalleryItem[]> {
    return await db.select().from(privateGalleryItems);
  }

  async getPrivateGalleryItem(id: number): Promise<PrivateGalleryItem | undefined> {
    const result = await db.select().from(privateGalleryItems).where(eq(privateGalleryItems.id, id)).limit(1);
    return result[0];
  }

  async createPrivateGalleryItem(item: InsertPrivateGalleryItem): Promise<PrivateGalleryItem> {
    const result = await db.insert(privateGalleryItems).values(item).returning();
    return result[0];
  }

  async updatePrivateGalleryItem(id: number, item: Partial<InsertPrivateGalleryItem>): Promise<PrivateGalleryItem | undefined> {
    const result = await db
      .update(privateGalleryItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(privateGalleryItems.id, id))
      .returning();
    return result[0];
  }

  async deletePrivateGalleryItem(id: number): Promise<boolean> {
    const result = await db.delete(privateGalleryItems).where(eq(privateGalleryItems.id, id)).returning();
    return result.length > 0;
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    try {
      return await db.select().from(projects).orderBy(sql`${projects.year} DESC`);
    } catch (error) {
      console.error("Error fetching projects from DB:", error);
      throw error;
    }
  }

  async getProject(id: number): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
  }

  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const result = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return result[0];
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }

  // Project Category methods
  async getAllProjectCategories(): Promise<ProjectCategory[]> {
    return await db.select().from(projectCategories).orderBy(projectCategories.name);
  }

  async createProjectCategory(category: InsertProjectCategory): Promise<ProjectCategory> {
    const result = await db.insert(projectCategories).values(category).returning();
    return result[0];
  }

  async deleteProjectCategory(id: number): Promise<boolean> {
    const result = await db.delete(projectCategories).where(eq(projectCategories.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
