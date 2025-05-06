import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table (already defined)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  role: text("role").default("user"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Content status enum
export const contentStatusEnum = pgEnum("content_status", ["draft", "published", "scheduled"]);

// Content visibility enum
export const contentVisibilityEnum = pgEnum("content_visibility", ["public", "private", "members"]);

// Content table
export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  status: contentStatusEnum("status").default("draft").notNull(),
  visibility: contentVisibilityEnum("visibility").default("public").notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  views: integer("views").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Statistics table
export const statistics = pgTable("statistics", {
  id: serial("id").primaryKey(),
  totalUsers: integer("total_users").default(0).notNull(),
  totalContent: integer("total_content").default(0).notNull(),
  totalViews: integer("total_views").default(0).notNull(),
  contentPublished: integer("content_published").default(0).notNull(),
  contentDrafts: integer("content_drafts").default(0).notNull(),
  interaction: integer("interaction").default(0).notNull(),
  avgTimeSeconds: integer("avg_time_seconds").default(0).notNull(),
  weeklyUserChange: integer("weekly_user_change").default(0).notNull(),
  weeklyContentChange: integer("weekly_content_change").default(0).notNull(),
  weeklyViewChange: integer("weekly_view_change").default(0).notNull(),
  weeklyTimeChange: integer("weekly_time_change").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  content: many(content),
  notifications: many(notifications),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  content: many(content),
}));

export const contentRelations = relations(content, ({ one }) => ({
  author: one(users, {
    fields: [content.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [content.categoryId],
    references: [categories.id],
  }),
}));

// Define schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  username: (schema) => schema.min(3, "Username must be at least 3 characters"),
  password: (schema) => schema.min(6, "Password must be at least 6 characters"),
});

export const insertCategorySchema = createInsertSchema(categories, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  slug: (schema) => schema.min(2, "Slug must be at least 2 characters"),
});

export const insertContentSchema = createInsertSchema(content, {
  title: (schema) => schema.min(3, "Title must be at least 3 characters"),
  body: (schema) => schema.min(10, "Content must be at least 10 characters"),
});

export const updateContentSchema = insertContentSchema.omit({ createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertContent = z.infer<typeof insertContentSchema>;
export type UpdateContent = z.infer<typeof updateContentSchema>;
export type Content = typeof content.$inferSelect;

export type Notification = typeof notifications.$inferSelect;
