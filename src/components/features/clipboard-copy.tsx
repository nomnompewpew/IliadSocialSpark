'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

interface ClipboardCopyProps {
  textToCopy: string;
}

export function ClipboardCopy({ textToCopy }: ClipboardCopyProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied to clipboard!",
      description: "You can now paste the content.",
    });
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 flex-shrink-0">
      <Copy className="h-4 w-4" />
      <span className="sr-only">Copy to clipboard</span>
    </Button>
  );
}