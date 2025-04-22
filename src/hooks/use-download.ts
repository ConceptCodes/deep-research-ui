import { useCallback } from "react";

const useDownload = (content: string, filename = "download.md") => {
  const downloadMarkdown = useCallback(() => {
    if (!content) {
      console.error("No content provided for download.");
      return;
    }

    const finalFilename = filename.endsWith(".md")
      ? filename
      : `${filename}.md`;

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", finalFilename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }, [content, filename]);

  return downloadMarkdown;
};

export default useDownload;
