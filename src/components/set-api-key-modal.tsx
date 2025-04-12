"use client";

import { useState, useEffect } from "react";
import { Key } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useToast } from "@/hooks/use-toast";
import useStore from "@/hooks/use-store";

export function ApiKeyModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localDeepSeekKey, setLocalDeepSeekKey] = useState("");
  const [localTavilyKey, setLocalTavilyKey] = useState("");
  const { toast } = useToast();

  const { setDeepSeekApiKey, deepSeekApiKey, setTavilyApiKey, tavilyApiKey } =
    useStore();

  useEffect(() => {
    if (isModalOpen) {
      setLocalDeepSeekKey("");
      setLocalTavilyKey("");
    }
  }, [isModalOpen]);

  const handleSaveApiKeys = () => {
    if (!localDeepSeekKey.trim() && !localTavilyKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter at least one API key.",
        variant: "destructive",
      });
      return;
    }

    if (localDeepSeekKey.trim()) {
      setDeepSeekApiKey(localDeepSeekKey.trim());
    }

    if (localTavilyKey.trim()) {
      setTavilyApiKey(localTavilyKey.trim());
    }

    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved successfully.",
    });

    setIsModalOpen(false);
  };

  const handleClearDeepSeekKey = () => {
    setDeepSeekApiKey(null);
    setLocalDeepSeekKey("");

    toast({
      title: "DeepSeek API Key Removed",
      description: "Your DeepSeek API key has been removed.",
    });
  };

  const handleClearTavilyKey = () => {
    setTavilyApiKey(null);
    setLocalTavilyKey("");

    toast({
      title: "Tavily API Key Removed",
      description: "Your Tavily API key has been removed.",
    });
  };

  const hasAnyKey = deepSeekApiKey ?? tavilyApiKey;

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant={hasAnyKey ? "outline" : "default"}
          className="gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Key className="h-4 w-4" />
          {hasAnyKey ? "Update API Keys" : "Set API Keys"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API Keys Configuration</DialogTitle>
          <DialogDescription>
            Enter your API keys to use with Deep Research. Your keys are stored
            locally and never sent to our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="deepSeekApiKey">DeepSeek API Key</Label>
            <Input
              id="deepSeekApiKey"
              type="password"
              placeholder={
                deepSeekApiKey
                  ? "••••••••••••••••"
                  : "Enter your DeepSeek API key"
              }
              value={localDeepSeekKey}
              onChange={(e) => setLocalDeepSeekKey(e.target.value)}
            />
            {deepSeekApiKey && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearDeepSeekKey}
                  className="h-6 px-2 text-xs"
                >
                  Remove Key
                </Button>
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tavilyApiKey">Tavily API Key</Label>
            <Input
              id="tavilyApiKey"
              type="password"
              placeholder={
                tavilyApiKey ? "••••••••••••••••" : "Enter your Tavily API key"
              }
              value={localTavilyKey}
              onChange={(e) => setLocalTavilyKey(e.target.value)}
            />
            {tavilyApiKey && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearTavilyKey}
                  className="h-6 px-2 text-xs"
                >
                  Remove Key
                </Button>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveApiKeys}>Save Keys</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
