import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { Group } from "@/utils/mockData";

interface GroupCardProps {
  group: Group;
}

const GroupCard = ({ group }: GroupCardProps) => {
  const navigate = useNavigate();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Group ID:", group.id); // Print group id in console
    navigate(`/groups/${group.id}`);
  };

  return (
    <Link to="#" onClick={handleClick}>
      <Card className="h-full overflow-hidden transition-all hover:scale-[1.01] hover:shadow-elevate border-none shadow-subtle">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <Badge variant="secondary" className="text-xs">
                <Users className="mr-1 h-3 w-3" />
                {group.members.length} {group.members.length === 1 ? "member" : "members"}
              </Badge>
              <h3 className="font-semibold text-lg">{group.name}</h3>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          {group.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {group.description}
            </p>
          )}
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3 mr-1" />
            <span>Created {formatDate(group.createdAt)}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-2 flex justify-between items-center">
          <div className="flex -space-x-2">
            {group.members.slice(0, 4).map((member) => (
              <Avatar key={member.id} className="border-2 border-background h-8 w-8">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{getInitials(member.name || "Unknown")}</AvatarFallback>
              </Avatar>
            ))}
            {group.members.length > 4 && (
              <Avatar className="border-2 border-background h-8 w-8">
                <AvatarFallback>+{group.members.length - 4}</AvatarFallback>
              </Avatar>
            )}
          </div>
          <Badge variant="outline" className="text-xs rounded-full">
            View Details
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default GroupCard;
