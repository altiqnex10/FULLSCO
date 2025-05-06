// Types for the application
export type User = {
  id: number;
  username: string;
  name?: string;
  role?: string;
  avatar?: string;
};

export type ContentStatus = 'draft' | 'published' | 'scheduled';
export type ContentVisibility = 'public' | 'private' | 'members';

export type Content = {
  id: number;
  title: string;
  body: string;
  status: ContentStatus;
  visibility: ContentVisibility;
  categoryId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  author?: User;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

export type Stats = {
  totalUsers: number;
  totalContent: number;
  totalViews: number;
  avgTime: string;
  contentStats: {
    published: number;
    drafts: number;
    interaction: number;
  };
  weeklyChanges: {
    users: number;
    content: number;
    views: number;
    time: number;
  };
};

export type Notification = {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
};
