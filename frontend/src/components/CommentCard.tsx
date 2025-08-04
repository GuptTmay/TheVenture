import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ageFinder } from '@/lib/helper';

type CommentCardProps = {
  content: string;
  authorName: string;
  authorId: string; 
  createdAt: string;
};

const CommentCard = ({
  content,
  authorName,
  authorId,
  createdAt,
}: CommentCardProps) => {
  // Get initials for fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="w-full">
      <CardContent className="">
        <div className="flex space-x-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage
              src={`https://api.dicebear.com/9.x/notionists/svg?seed=${authorId ?? 0}`}
              alt={`${authorName}'s avatar`}
            />
            <AvatarFallback className="text-sm">
              {getInitials(authorName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center space-x-2">
              <span className="text-foreground text-sm font-medium">
                {authorName}
              </span>
              <span className="text-muted-foreground text-xs">
                {ageFinder(createdAt)}
              </span>
            </div>

            <p className="text-foreground text-sm leading-relaxed break-words">
              {content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentCard;
