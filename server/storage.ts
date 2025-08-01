import { type User, type InsertUser, type Generation, type InsertGeneration, type UsageSession, type InsertUsageSession } from "../shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getUsageSession(sessionId: string): Promise<UsageSession | undefined>;
  createUsageSession(session: InsertUsageSession): Promise<UsageSession>;
  updateUsageSession(sessionId: string, generationsUsed: number): Promise<UsageSession | undefined>;
  
  createGeneration(generation: InsertGeneration): Promise<Generation>;
  getGenerationsBySession(sessionId: string): Promise<Generation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private generations: Map<string, Generation>;
  private usageSessions: Map<string, UsageSession>;

  constructor() {
    this.users = new Map();
    this.generations = new Map();
    this.usageSessions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUsageSession(sessionId: string): Promise<UsageSession | undefined> {
    return Array.from(this.usageSessions.values()).find(
      (session) => session.sessionId === sessionId
    );
  }

  async createUsageSession(insertSession: InsertUsageSession): Promise<UsageSession> {
    const id = randomUUID();
    const session: UsageSession = { 
      ...insertSession, 
      id,
      generationsUsed: insertSession.generationsUsed ?? 0,
      isPro: insertSession.isPro ?? 0,
      createdAt: new Date()
    };
    this.usageSessions.set(id, session);
    return session;
  }

  async updateUsageSession(sessionId: string, generationsUsed: number): Promise<UsageSession | undefined> {
    const session = await this.getUsageSession(sessionId);
    if (session) {
      session.generationsUsed = generationsUsed;
      this.usageSessions.set(session.id, session);
      return session;
    }
    return undefined;
  }

  async createGeneration(insertGeneration: InsertGeneration): Promise<Generation> {
    const id = randomUUID();
    const generation: Generation = { 
      ...insertGeneration, 
      id,
      createdAt: new Date()
    };
    this.generations.set(id, generation);
    return generation;
  }

  async getGenerationsBySession(sessionId: string): Promise<Generation[]> {
    return Array.from(this.generations.values()).filter(
      (generation) => generation.sessionId === sessionId
    );
  }
}

export const storage = new MemStorage();
