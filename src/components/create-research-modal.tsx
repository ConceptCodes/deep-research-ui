"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

import useStore from "@/hooks/use-store";
import { useToast } from "@/hooks/use-toast";

const models = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "o3-mini", label: "o3 Mini" },
  { value: "o4-mini", label: "o4 Mini" },
] as const;

type Model = (typeof models)[number]["value"];

const MAX_RESEARCH_LOOPS = 10;
const MIN_RESEARCH_LOOPS = 1;

export function CreateResearchModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mainTopic, setMainTopic] = useState("");
  const [subTopicInput, setSubTopicInput] = useState("");
  const [subTopics, setSubTopics] = useState<string[]>([]);
  const [maxLoops, setMaxLoops] = useState(3);
  const [selectedModel, setSelectedModel] = useState<Model>("gpt-4o-mini");

  const router = useRouter();
  const { toast } = useToast();
  const { addResearch, setSelectedResearchId, openAiApiKey, tavilyApiKey } =
    useStore();

  const handleAddSubTopic = useCallback(() => {
    const trimmedInput = subTopicInput.trim();
    if (trimmedInput !== "" && !subTopics.includes(trimmedInput)) {
      setSubTopics((prevTopics) => [...prevTopics, trimmedInput]);
      setSubTopicInput("");
    }
  }, [subTopicInput, subTopics]);

  const handleRemoveSubTopic = useCallback((topicToRemove: string) => {
    setSubTopics((prevTopics) => prevTopics.filter((t) => t !== topicToRemove));
  }, []);

  const resetForm = useCallback(() => {
    setMainTopic("");
    setSubTopics([]);
    setSubTopicInput("");
    setMaxLoops(3);
    setSelectedModel("gpt-4o-mini");
  }, []);

  const handleSubmit = () => {
    const trimmedMainTopic = mainTopic.trim();
    if (trimmedMainTopic === "" || subTopics.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide a main topic and at least one sub-topic.",
        variant: "destructive",
      });
      return;
    }

    const { id } = addResearch({
      topic: trimmedMainTopic,
      subTopics,
      maxResearchLoops: maxLoops,
      status: "pending",
      model: selectedModel,
    });

    setSelectedResearchId(id);
    resetForm();
    setIsModalOpen(false);
    router.push("/research");
  };

  const handleSubTopicKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSubTopic();
    }
  };

  const handleAttemptOpenModal = () => {
    if (!openAiApiKey || !tavilyApiKey) {
      setIsModalOpen(false);
      toast({
        title: "API Keys Required",
        description:
          "Please set your OpenAI and Tavily API keys in the settings before creating a project.",
        variant: "destructive",
      });
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div
        role="button"
        className="flex h-[250px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition-colors hover:bg-accent/50"
        onClick={handleAttemptOpenModal}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleAttemptOpenModal();
        }}
      >
        <PlusCircle
          className="mb-4 h-12 w-12 text-muted-foreground"
          aria-hidden="true"
        />
        <h3 className="text-lg font-medium">Create New Research</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Start a new AI-powered research project
        </p>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Research Project</DialogTitle>
            <DialogDescription>
              Define the main topic, sub-topics, and settings for your research.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="grid gap-6 py-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="main-topic">Main Topic</Label>
              <Input
                id="main-topic"
                placeholder="e.g., The Future of Renewable Energy"
                value={mainTopic}
                onChange={(e) => setMainTopic(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sub-topics">Sub-Topics</Label>
              <div className="flex gap-2">
                <Input
                  id="sub-topics"
                  placeholder="Add specific areas to research"
                  value={subTopicInput}
                  onChange={(e) => setSubTopicInput(e.target.value)}
                  onKeyDown={handleSubTopicKeyDown}
                />
                <Button
                  type="button"
                  onClick={handleAddSubTopic}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              {subTopics.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {subTopics.map((subTopic) => (
                    <Badge
                      key={subTopic}
                      variant="secondary"
                      className="flex items-center gap-1 pl-2 pr-1"
                    >
                      {subTopic}
                      <button
                        type="button"
                        onClick={() => handleRemoveSubTopic(subTopic)}
                        className="ml-1 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label={`Remove ${subTopic}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="model">AI Model</Label>
              <Select
                value={selectedModel}
                onValueChange={(value: Model) => setSelectedModel(value)}
              >
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select AI model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                GPT-4o is powerful but slower/pricier. GPT-4o Mini is
                faster/cheaper.
              </p>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="max-loops">Max Research Loops</Label>
                <span className="text-sm font-medium text-muted-foreground">
                  {maxLoops}
                </span>
              </div>
              <Slider
                id="max-loops"
                min={MIN_RESEARCH_LOOPS}
                max={MAX_RESEARCH_LOOPS}
                step={1}
                value={[maxLoops]}
                onValueChange={(values) =>
                  setMaxLoops(values[0] ?? MIN_RESEARCH_LOOPS)
                }
                aria-label="Maximum research loops slider"
              />
              <p className="text-xs text-muted-foreground">
                Controls research depth. More loops mean deeper analysis but
                take longer.
              </p>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={mainTopic.trim() === "" || subTopics.length === 0}
              >
                Create Project
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
