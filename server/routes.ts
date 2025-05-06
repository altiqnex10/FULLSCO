import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContentSchema, 
  updateContentSchema, 
  insertCategorySchema,
  insertUserSchema
} from "@shared/schema";
import { z, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcryptjs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper to handle async routes
  const asyncHandler = (fn: (req: Request, res: Response) => Promise<any>) => (req: Request, res: Response) => 
    Promise.resolve(fn(req, res)).catch(error => {
      console.error('Error:', error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: fromZodError(error).message 
        });
      }
      
      res.status(500).json({ message: error.message });
    });

  // Format seconds to time string
  const formatTimeFromSeconds = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // API routes
  const apiPrefix = '/api';

  // Auth routes
  app.get(`${apiPrefix}/auth/user`, asyncHandler(async (req, res) => {
    // For demo purposes, return a mock user
    // In a real application, this would use the authenticated user from the session
    const user = await storage.getUserById(1);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  }));

  // Categories routes
  app.get(`${apiPrefix}/categories`, asyncHandler(async (req, res) => {
    const categories = await storage.getAllCategories();
    return res.json(categories);
  }));

  app.get(`${apiPrefix}/categories/:id`, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const category = await storage.getCategoryById(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    return res.json(category);
  }));

  app.post(`${apiPrefix}/categories`, asyncHandler(async (req, res) => {
    const validatedData = insertCategorySchema.parse(req.body);
    const newCategory = await storage.insertCategory(validatedData);
    return res.status(201).json(newCategory);
  }));

  // Content routes
  app.get(`${apiPrefix}/content`, asyncHandler(async (req, res) => {
    const allContent = await storage.getAllContent();
    return res.json(allContent);
  }));

  app.get(`${apiPrefix}/content/recent`, asyncHandler(async (req, res) => {
    const recentContent = await storage.getRecentContent();
    return res.json(recentContent);
  }));

  app.get(`${apiPrefix}/content/drafts`, asyncHandler(async (req, res) => {
    const drafts = await storage.getDraftContent();
    return res.json(drafts);
  }));

  app.get(`${apiPrefix}/content/:id`, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const contentItem = await storage.getContentById(id);
    
    if (!contentItem) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    return res.json(contentItem);
  }));

  app.post(`${apiPrefix}/content`, asyncHandler(async (req, res) => {
    const validatedData = insertContentSchema.parse(req.body);
    
    // In a real application, use the authenticated user's ID
    // For demo purposes, use user ID 1
    const newContent = await storage.insertContent({
      ...validatedData,
      authorId: 1,
    });
    
    // Add notification
    await storage.addNotification(1, `تم إنشاء محتوى جديد: ${newContent.title}`);
    
    return res.status(201).json(newContent);
  }));

  app.patch(`${apiPrefix}/content/:id`, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const validatedData = updateContentSchema.parse(req.body);
    
    const existingContent = await storage.getContentById(id);
    if (!existingContent) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    const updatedContent = await storage.updateContent(id, validatedData);
    
    // Add notification if status changed to published
    if (existingContent.status !== 'published' && validatedData.status === 'published') {
      await storage.addNotification(1, `تم نشر محتوى: ${updatedContent.title}`);
    }
    
    return res.json(updatedContent);
  }));

  app.delete(`${apiPrefix}/content/:id`, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    
    const existingContent = await storage.getContentById(id);
    if (!existingContent) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    const deletedContent = await storage.deleteContent(id);
    
    // Add notification
    await storage.addNotification(1, `تم حذف محتوى: ${deletedContent.title}`);
    
    return res.json(deletedContent);
  }));

  // Statistics routes
  app.get(`${apiPrefix}/stats`, asyncHandler(async (req, res) => {
    const rawStats = await storage.getStatistics();
    
    if (!rawStats) {
      return res.status(404).json({ message: 'Statistics not found' });
    }
    
    // Transform statistics to match the expected format
    const stats = {
      totalUsers: rawStats.totalUsers,
      totalContent: rawStats.totalContent,
      totalViews: rawStats.totalViews,
      avgTime: formatTimeFromSeconds(rawStats.avgTimeSeconds),
      contentStats: {
        published: rawStats.contentPublished,
        drafts: rawStats.contentDrafts,
        interaction: rawStats.interaction,
      },
      weeklyChanges: {
        users: rawStats.weeklyUserChange,
        content: rawStats.weeklyContentChange,
        views: rawStats.weeklyViewChange,
        time: rawStats.weeklyTimeChange,
      },
    };
    
    return res.json(stats);
  }));

  // Notifications routes
  app.get(`${apiPrefix}/notifications`, asyncHandler(async (req, res) => {
    // In a real application, use the authenticated user's ID
    // For demo purposes, use user ID 1
    const notifications = await storage.getNotificationsByUserId(1);
    return res.json(notifications);
  }));

  app.post(`${apiPrefix}/notifications/:id/read`, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const updatedNotification = await storage.markNotificationAsRead(id);
    return res.json(updatedNotification);
  }));

  const httpServer = createServer(app);

  return httpServer;
}
