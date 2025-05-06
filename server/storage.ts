import { db } from "@db";
import { 
  users, 
  content, 
  categories, 
  statistics, 
  notifications,
  InsertUser,
  InsertCategory,
  InsertContent,
  UpdateContent
} from "@shared/schema";
import { eq, desc, and, or, count } from "drizzle-orm";

export const storage = {
  // Users
  async getUserById(id: number) {
    return await db.query.users.findFirst({
      where: eq(users.id, id)
    });
  },

  async getUserByUsername(username: string) {
    return await db.query.users.findFirst({
      where: eq(users.username, username)
    });
  },

  async insertUser(user: InsertUser) {
    const [result] = await db.insert(users).values(user).returning();
    return result;
  },

  // Categories
  async getAllCategories() {
    return await db.query.categories.findMany({
      orderBy: categories.name
    });
  },

  async getCategoryById(id: number) {
    return await db.query.categories.findFirst({
      where: eq(categories.id, id)
    });
  },

  async getCategoryBySlug(slug: string) {
    return await db.query.categories.findFirst({
      where: eq(categories.slug, slug)
    });
  },

  async insertCategory(category: InsertCategory) {
    const [result] = await db.insert(categories).values(category).returning();
    return result;
  },

  // Content
  async getAllContent() {
    return await db.query.content.findMany({
      orderBy: desc(content.updatedAt),
      with: {
        category: true,
        author: true
      }
    });
  },

  async getContentById(id: number) {
    return await db.query.content.findFirst({
      where: eq(content.id, id),
      with: {
        category: true,
        author: true
      }
    });
  },

  async getRecentContent(limit = 5) {
    return await db.query.content.findMany({
      orderBy: desc(content.updatedAt),
      limit,
      with: {
        category: true,
        author: true
      }
    });
  },

  async getDraftContent(limit = 5) {
    return await db.query.content.findMany({
      where: eq(content.status, 'draft'),
      orderBy: desc(content.updatedAt),
      limit,
      with: {
        category: true,
        author: true
      }
    });
  },

  async insertContent(newContent: InsertContent) {
    const [result] = await db.insert(content).values(newContent).returning();
    
    // Update statistics after content insertion
    await this.updateContentStatistics();
    
    return result;
  },

  async updateContent(id: number, updatedContent: UpdateContent) {
    const [result] = await db
      .update(content)
      .set({
        ...updatedContent,
        updatedAt: new Date()
      })
      .where(eq(content.id, id))
      .returning();
    
    // Update statistics after content update
    await this.updateContentStatistics();
    
    return result;
  },

  async deleteContent(id: number) {
    const [result] = await db
      .delete(content)
      .where(eq(content.id, id))
      .returning();
    
    // Update statistics after content deletion
    await this.updateContentStatistics();
    
    return result;
  },

  async incrementContentViews(id: number) {
    const contentItem = await db.query.content.findFirst({
      where: eq(content.id, id)
    });

    if (!contentItem) return null;

    const [result] = await db
      .update(content)
      .set({
        views: contentItem.views + 1,
      })
      .where(eq(content.id, id))
      .returning();
    
    // Update statistics
    await this.updateViewStatistics();
    
    return result;
  },

  // Statistics
  async getStatistics() {
    const stats = await db.query.statistics.findFirst({
      orderBy: desc(statistics.updatedAt)
    });

    if (!stats) {
      // If no statistics exist, create initial statistics
      await this.updateAllStatistics();
      return await db.query.statistics.findFirst({
        orderBy: desc(statistics.updatedAt)
      });
    }

    return stats;
  },

  async updateAllStatistics() {
    // Get counts
    const totalUsersResult = await db.select({ count: count() }).from(users);
    const totalUsers = totalUsersResult[0].count;

    const totalContentResult = await db.select({ count: count() }).from(content);
    const totalContent = totalContentResult[0].count;

    const totalViews = await this.getTotalViews();

    const publishedContentResult = await db
      .select({ count: count() })
      .from(content)
      .where(eq(content.status, 'published'));
    const publishedContent = publishedContentResult[0].count;

    const draftContentResult = await db
      .select({ count: count() })
      .from(content)
      .where(eq(content.status, 'draft'));
    const draftContent = draftContentResult[0].count;

    // Calculate percentages
    const contentPublished = totalContent > 0 ? Math.round((publishedContent / totalContent) * 100) : 0;
    const contentDrafts = totalContent > 0 ? Math.round((draftContent / totalContent) * 100) : 0;

    // Use placeholder values for these metrics since they would typically come from analytics
    const interaction = 60; // This would typically come from user engagement metrics
    const avgTimeSeconds = 755; // 12:35 in seconds - would typically come from analytics

    // Weekly changes - using placeholder values for demonstration
    const weeklyUserChange = 12;
    const weeklyContentChange = 8;
    const weeklyViewChange = -3;
    const weeklyTimeChange = 5;

    // Insert or update statistics
    const existingStats = await db.query.statistics.findFirst();

    if (existingStats) {
      await db
        .update(statistics)
        .set({
          totalUsers,
          totalContent,
          totalViews,
          contentPublished,
          contentDrafts,
          interaction,
          avgTimeSeconds,
          weeklyUserChange,
          weeklyContentChange,
          weeklyViewChange,
          weeklyTimeChange,
          updatedAt: new Date()
        })
        .where(eq(statistics.id, existingStats.id));
    } else {
      await db
        .insert(statistics)
        .values({
          totalUsers,
          totalContent,
          totalViews,
          contentPublished,
          contentDrafts,
          interaction,
          avgTimeSeconds,
          weeklyUserChange,
          weeklyContentChange,
          weeklyViewChange,
          weeklyTimeChange
        });
    }
  },

  async updateContentStatistics() {
    // Get counts
    const totalContentResult = await db.select({ count: count() }).from(content);
    const totalContent = totalContentResult[0].count;

    const publishedContentResult = await db
      .select({ count: count() })
      .from(content)
      .where(eq(content.status, 'published'));
    const publishedContent = publishedContentResult[0].count;

    const draftContentResult = await db
      .select({ count: count() })
      .from(content)
      .where(eq(content.status, 'draft'));
    const draftContent = draftContentResult[0].count;

    // Calculate percentages
    const contentPublished = totalContent > 0 ? Math.round((publishedContent / totalContent) * 100) : 0;
    const contentDrafts = totalContent > 0 ? Math.round((draftContent / totalContent) * 100) : 0;

    // Weekly changes - placeholder for demo
    const weeklyContentChange = 8;

    // Update statistics
    const existingStats = await db.query.statistics.findFirst();

    if (existingStats) {
      await db
        .update(statistics)
        .set({
          totalContent,
          contentPublished,
          contentDrafts,
          weeklyContentChange,
          updatedAt: new Date()
        })
        .where(eq(statistics.id, existingStats.id));
    } else {
      await this.updateAllStatistics();
    }
  },

  async updateViewStatistics() {
    const totalViews = await this.getTotalViews();
    
    // Weekly changes - placeholder for demo
    const weeklyViewChange = -3;

    // Update statistics
    const existingStats = await db.query.statistics.findFirst();

    if (existingStats) {
      await db
        .update(statistics)
        .set({
          totalViews,
          weeklyViewChange,
          updatedAt: new Date()
        })
        .where(eq(statistics.id, existingStats.id));
    } else {
      await this.updateAllStatistics();
    }
  },

  async getTotalViews() {
    const result = await db
      .select({
        totalViews: db.fn.sum(content.views)
      })
      .from(content);
    
    return Number(result[0].totalViews) || 0;
  },

  // Notifications
  async getNotificationsByUserId(userId: number) {
    return await db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: desc(notifications.createdAt)
    });
  },

  async addNotification(userId: number, message: string) {
    const [result] = await db
      .insert(notifications)
      .values({
        userId,
        message
      })
      .returning();
    
    return result;
  },

  async markNotificationAsRead(id: number) {
    const [result] = await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .returning();
    
    return result;
  }
};
