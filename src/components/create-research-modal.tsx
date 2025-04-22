"use client";

import type React from "react";

import { useState } from "react";
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

export function CreateResearchModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [maxLoops, setMaxLoops] = useState(3);
  const [model, setModel] = useState<"gpt-4o" | "gpt-4o-mini">("gpt-4o-mini");
  const router = useRouter();
  const { toast } = useToast();

  const { addResearch, setSelectedResearchId, openAiApiKey, tavilyApiKey } =
    useStore();

  const handleAddTopic = () => {
    if (topicInput.trim() !== "" && !topics.includes(topicInput.trim())) {
      setTopics([...topics, topicInput.trim()]);
      setTopicInput("");
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setTopics(topics.filter((t) => t !== topic));
  };

  const handleSubmit = () => {
    if (topic.trim() === "" || topics.length === 0) return;

    const { id } = addResearch({
      topic,
      subTopics: topics,
      maxResearchLoops: maxLoops,
      status: "pending",
      model,
    });

    setSelectedResearchId(id);
    setTimeout(() => {
      setIsModalOpen(false);
      router.push("/research");
    }, 1000);

    setTopic("");
    setTopics([]);
    setTopicInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTopic();
    }
  };

  const handleOpenModal = () => {
    if (
      !openAiApiKey ||
      openAiApiKey === "" ||
      !tavilyApiKey ||
      tavilyApiKey === ""
    ) {
      toast({
        title: "API Key Required",
        description:
          "Please set your OpenAi and Tavily API keys in the settings.",
        variant: "destructive",
      });
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <div
          className="flex h-[250px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 transition-colors hover:bg-accent/50"
          onClick={handleOpenModal}
        >
          <PlusCircle className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">Create New Research</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Start a new AI-powered research project
          </p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Research Project</DialogTitle>
          <DialogDescription>
            Set up your AI-powered research project with topics and model
            selection.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Main Topic</Label>
            <Input
              id="topic"
              placeholder="Enter the main topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="topics">Topics</Label>
            <div className="flex gap-2">
              <Input
                id="topics"
                placeholder="Add research topics"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button type="button" onClick={handleAddTopic}>
                Add
              </Button>
            </div>
            {topics.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {topics.map((topic, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {topic}
                    <button
                      onClick={() => handleRemoveTopic(topic)}
                      className="ml-1 rounded-full p-0.5 hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {topic}</span>
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="model">AI Model</Label>
            <Select
              value={model}
              onValueChange={(value: "gpt-4o" | "gpt-4o-mini") =>
                setModel(value)
              }
            >
              <SelectTrigger id="model">
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose the AI model for research generation. GPT-4o is more
              powerful but slower and more expensive.
            </p>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="max-loops">Max Research Loops</Label>
              <span className="text-sm text-muted-foreground">{maxLoops}</span>
            </div>
            <Slider
              id="max-loops"
              min={1}
              max={10}
              step={1}
              value={[maxLoops]}
              onValueChange={(values) => setMaxLoops(values[0]!)}
            />
            <p className="text-xs text-muted-foreground">
              Controls how many iterations of research the AI will perform.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
