import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // Hash the password for security
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Check if admin user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.username, "admin")
    });

    // Create admin user if it doesn't exist
    if (!existingUser) {
      console.log("👤 Creating admin user...");
      await db.insert(schema.users).values({
        username: "admin",
        password: hashedPassword,
        name: "أحمد خالد",
        role: "مدير المنصة",
        avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
      });
    } else {
      console.log("👤 Admin user already exists, skipping...");
    }

    // Define categories
    const categoriesToSeed = [
      { name: "برمجة", slug: "programming", description: "دروس ومقالات في البرمجة وتطوير البرمجيات" },
      { name: "تصميم", slug: "design", description: "دروس ومقالات في تصميم واجهات المستخدم وتجربة المستخدم" },
      { name: "تسويق", slug: "marketing", description: "استراتيجيات وأساليب التسويق الرقمي" },
      { name: "أعمال", slug: "business", description: "إدارة المشاريع وريادة الأعمال" },
    ];

    // Seed categories
    console.log("📂 Seeding categories...");
    for (const category of categoriesToSeed) {
      const existingCategory = await db.query.categories.findFirst({
        where: eq(schema.categories.slug, category.slug)
      });

      if (!existingCategory) {
        await db.insert(schema.categories).values(category);
        console.log(`  ✓ Added category: ${category.name}`);
      } else {
        console.log(`  → Category '${category.name}' already exists, skipping...`);
      }
    }

    // Get the categories from the database to use their IDs
    const categories = await db.query.categories.findMany();
    const categoryMap = categories.reduce((map, category) => {
      map[category.slug] = category.id;
      return map;
    }, {} as Record<string, number>);

    // Define content
    const contentToSeed = [
      {
        title: "مقدمة في React Hooks",
        body: "<h2>مقدمة</h2><p>تعتبر React Hooks من أهم الميزات التي تم إضافتها إلى مكتبة React والتي غيرت طريقة كتابة مكونات React.</p><h2>ما هي الـ Hooks؟</h2><p>الـ Hooks هي وظائف تتيح لك استخدام حالة React وميزات أخرى في المكونات الوظيفية، بدلاً من الحاجة إلى كتابة مكونات صفية.</p>",
        status: "published",
        visibility: "public",
        categoryId: categoryMap["programming"],
        views: 325,
      },
      {
        title: "بناء واجهات المستخدم باستخدام TailwindCSS",
        body: "<p>TailwindCSS هو إطار عمل CSS يعتمد على الفئات المساعدة ويسمح لك ببناء واجهات مستخدم مخصصة بسرعة.</p><h3>مميزات TailwindCSS</h3><ul><li>مرونة عالية في التصميم</li><li>حجم ملف CSS أصغر في الإنتاج</li><li>تجربة مطور محسنة</li></ul>",
        status: "published",
        visibility: "public",
        categoryId: categoryMap["design"],
        views: 210,
      },
      {
        title: "أساسيات Express.js والـ API",
        body: "<p>في هذا الدرس، سنتعلم كيفية بناء واجهات برمجة التطبيقات (APIs) باستخدام إطار العمل Express.js. سنتناول المفاهيم الأساسية مثل الطلبات والاستجابات، ومعالجة المسارات، والتعامل مع قواعد البيانات.</p>",
        status: "published",
        visibility: "public",
        categoryId: categoryMap["programming"],
        views: 178,
      },
      {
        title: "استخدام Nextjs مع Expressjs",
        body: "<p>مسودة لدرس حول كيفية الجمع بين Next.js و Express.js لبناء تطبيقات ويب متكاملة...</p>",
        status: "draft",
        visibility: "private",
        categoryId: categoryMap["programming"],
        views: 0,
      },
      {
        title: "النشر على منصة Replit",
        body: "<p>مسودة لدليل شامل حول كيفية نشر تطبيقات الويب على منصة Replit...</p>",
        status: "draft",
        visibility: "private",
        categoryId: categoryMap["programming"],
        views: 0,
      }
    ];

    // Get admin user to use as author
    const adminUser = await db.query.users.findFirst({
      where: eq(schema.users.username, "admin")
    });

    if (!adminUser) {
      throw new Error("Admin user not found");
    }

    // Seed content
    console.log("📝 Seeding content...");
    for (const item of contentToSeed) {
      const existingContent = await db.query.content.findFirst({
        where: eq(schema.content.title, item.title)
      });

      if (!existingContent) {
        // Define the content with correct types
        const contentToInsert = {
          title: item.title,
          body: item.body,
          status: item.status as 'draft' | 'published' | 'scheduled',
          visibility: item.visibility as 'public' | 'private' | 'members',
          categoryId: item.categoryId,
          authorId: adminUser.id,
          views: item.views || 0
        };
        await db.insert(schema.content).values(contentToInsert);
        console.log(`  ✓ Added content: ${item.title}`);
      } else {
        console.log(`  → Content '${item.title}' already exists, skipping...`);
      }
    }

    // Initialize statistics
    console.log("📊 Initializing statistics...");
    const existingStats = await db.query.statistics.findFirst();

    if (!existingStats) {
      // Calculate statistics
      const users = await db.query.users.findMany();
      const totalUsers = users.length;

      const allContent = await db.query.content.findMany();
      const totalContent = allContent.length;

      // Sum views
      const totalViews = allContent.reduce((sum, content) => sum + (content.views || 0), 0);

      // Count by status
      const publishedContent = allContent.filter(content => content.status === 'published').length;
      const draftContent = allContent.filter(content => content.status === 'draft').length;

      // Calculate percentages
      const contentPublished = totalContent > 0 ? Math.round((publishedContent / totalContent) * 100) : 0;
      const contentDrafts = totalContent > 0 ? Math.round((draftContent / totalContent) * 100) : 0;

      // Sample values for other metrics
      const interaction = 60;
      const avgTimeSeconds = 755; // 12:35 in seconds
      const weeklyUserChange = 12;
      const weeklyContentChange = 8;
      const weeklyViewChange = -3;
      const weeklyTimeChange = 5;

      await db.insert(schema.statistics).values({
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
      });

      console.log("  ✓ Statistics initialized");
    } else {
      console.log("  → Statistics already exist, skipping...");
    }

    // Add notifications
    console.log("🔔 Adding notifications...");
    const notificationsToSeed = [
      {
        message: "مرحبًا بك في منصة التعليم! اكتشف المحتوى المتاح وابدأ رحلة التعلم",
        read: false,
      },
      {
        message: "تم إضافة محتوى جديد: بناء واجهات المستخدم باستخدام TailwindCSS",
        read: false,
      },
      {
        message: "تحديث المنصة: تم إضافة ميزات جديدة للمحرر",
        read: true,
      }
    ];

    const existingNotifications = await db.query.notifications.findMany();
    
    if (existingNotifications.length === 0) {
      for (const notification of notificationsToSeed) {
        await db.insert(schema.notifications).values({
          ...notification,
          userId: adminUser.id,
        });
      }
      console.log(`  ✓ Added ${notificationsToSeed.length} notifications`);
    } else {
      console.log(`  → Notifications already exist, skipping...`);
    }

    console.log("✅ Seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

seed();
