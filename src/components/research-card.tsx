import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Research } from "@/hooks/use-store";
import useStore from "@/hooks/use-store";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { StatusBadge } from "./status-badge";

type ResearchCardProps = {
  project: Research;
};

export function ResearchCard({ project }: ResearchCardProps) {
  const { setSelectedResearchId, deleteResearch } = useStore();
  const router = useRouter();

  const handleClick = () => {
    setSelectedResearchId(project.id);
    router.push("/research");
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteResearch(project.id);
  };

  return (
    <Card
      className="flex h-[250px] flex-col hover:cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2">{project.topic}</CardTitle>
          <StatusBadge status={project.status} />
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
        <Button variant="outline" size="sm" onClick={handleDelete}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
