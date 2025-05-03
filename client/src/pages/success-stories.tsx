import { useState, useEffect } from 'react';
import { useSuccessStories } from '@/hooks/use-success-stories';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Helmet } from 'react-helmet';
import { Loader2, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/page-header';
import Container from '@/components/ui/container';
import { formatDate } from '@/lib/utils';

export default function SuccessStories() {
  const { successStories, isLoading } = useSuccessStories();
  const [isClient, setIsClient] = useState(false);

  // تحديث حالة العميل بعد التحميل
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>قصص النجاح | FULLSCO</title>
        <meta name="description" content="تجارب حقيقية للطلاب الذين حصلوا على منح دراسية وتفوقوا في دراستهم" />
      </Helmet>

      <PageHeader
        title="قصص النجاح"
        description="تجارب حقيقية للطلاب الذين حصلوا على منح دراسية وتفوقوا في دراستهم"
        bgClassName="bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-700 dark:to-indigo-800"
      />

      <Container>
        <div className="py-12">
          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : successStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {successStories.map((story) => (
                <Link key={story.id} href={`/success-stories/${story.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    {story.imageUrl && (
                      <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
                        <img 
                          src={story.imageUrl} 
                          alt={story.title} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-2">{story.title}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground space-x-2 space-x-reverse">
                        <User className="h-4 w-4 ml-1" />
                        <span className="font-medium text-foreground">{story.name}</span>
                        <span className="text-muted-foreground">•</span>
                        <Calendar className="h-4 w-4 ml-1" />
                        <span>{formatDate(story.createdAt)}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <CardDescription className="line-clamp-3">
                        {story.briefContent || story.title}
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        قراءة القصة كاملة
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">لا توجد قصص نجاح بعد</h3>
              <p className="text-muted-foreground mb-6">سيتم إضافة قصص نجاح قريبًا. تابعنا للاطلاع على تجارب الطلاب.</p>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}