"use client";

import { ResearchCard } from "@/components/research-card";
import { CreateResearchModal } from "@/components/create-research-modal";
import { ApiKeyModal } from "@/components/api-key-modal";

import useStore from "@/hooks/use-store";

export default function Home() {
  const { research } = useStore();

  return (
    <div className="container mx-auto p-20">
      <div className="mb-8 flex items-center justify-between">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">DeepResearch UI</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your AI-powered research projects
          </p>
        </div>

        <ApiKeyModal />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {research.map((project) => (
          <ResearchCard key={project.id} project={project} />
        ))}
        <CreateResearchModal />
      </div>
    </div>
  );
}
