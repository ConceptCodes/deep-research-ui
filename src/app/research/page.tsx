"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ResearchHeader } from "@/components/research-header";
import { ResearchContent } from "@/components/research-content";
import { ResearchSidebar } from "@/components/research-sidebar";
import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import type { Research } from "@/hooks/use-store";
import useStore from "@/hooks/use-store";

export default function ResearchPage() {
  const [project, setProject] = useState<Research | null>(null);
  const { getResearch, selectedResearchId } = useStore();

  useEffect(() => {
    if (selectedResearchId) {
      const research = getResearch(selectedResearchId);
      if (research) {
        setProject(research);
      }
    }
  }, [getResearch, selectedResearchId]);

  return (
    <div className="min-h-screen w-full justify-center px-20">
      <div className="container py-6">
        <Link
          href="/"
          className={cn("mb-6", buttonVariants({ variant: "ghost" }))}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        {project && (
          <>
            <ResearchHeader project={project} />
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
              <div className="lg:col-span-3">
                <ResearchContent project={project} />
              </div>
              <div className="lg:col-span-1">
                <ResearchSidebar project={project} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
