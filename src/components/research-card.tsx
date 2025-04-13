import { AlertCircle, CheckCircle, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Research, Status } from "@/hooks/use-store";
import useStore from "@/hooks/use-store";
import { useRouter } from "next/navigation";

interface ResearchCardProps {
  project: Research;
}

export function ResearchCard({ project }: ResearchCardProps) {
  const { setSelectedResearchId } = useStore();
  const router = useRouter();

  const statusIcons: Record<Status, React.ReactElement> = {
    completed: <CheckCircle className="mr-1 h-4 w-4" />,
    "in-progress": <Clock className="mr-1 h-4 w-4" />,
    pending: <Clock className="mr-1 h-4 w-4" />,
    failed: <AlertCircle className="mr-1 h-4 w-4" />,
  };

  const statusText = {
    completed: "Completed",
    "in-progress": "In Progress",
    pending: "Pending",
    failed: "Failed",
  };

  const statusColors = {
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "in-progress":
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    pending: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const handleClick = () => {
    setSelectedResearchId(project.id);
    router.push("/research");
  };

  return (
    <Card
      className="flex h-[250px] flex-col hover:cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2">{project.topic}</CardTitle>
          <Badge variant="outline" className={statusColors[project.status]}>
            <span className="flex items-center gap-1">
              {statusIcons[project.status]}
              {statusText[project.status]}
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-4 flex flex-wrap gap-2">
          {project.subTopics?.map((topic, index) => (
            <Badge key={index} variant="secondary">
              {topic}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Created: {new Date(project.createdAt).toLocaleDateString()}
        </div>
      </CardFooter>
    </Card>
  );
}
