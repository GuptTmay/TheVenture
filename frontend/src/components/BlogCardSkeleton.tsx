import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';

const BlogCardSkeleton = () => {
  return (
    <Card className="w-full rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm">
      <CardHeader className="flex items-center gap-4">
        <Skeleton className="size-7 rounded-full bg-secondary" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
      <CardFooter className="border-t border-border/20 pt-4">
        <Skeleton className="h-4 w-1/4" />
      </CardFooter>
    </Card>
  );
};

export default BlogCardSkeleton;
