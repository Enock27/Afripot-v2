import React, { useRef, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ImageIcon,
  FileUp,
  Figma,
  MonitorIcon,
  CircleUserRound,
  ArrowUpIcon,
  Paperclip,
  PlusIcon,
} from "lucide-react";

// Custom hook for auto-resizing textarea
const useAutoResizeTextarea = (value: string) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [value]);

  return textareaRef;
};

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border border-border p-3 transition-colors hover:bg-accent hover:text-accent-foreground",
        className,
      )}
      title={label}
    >
      {icon}
      <span className="text-xs text-center">{label}</span>
    </button>
  );
};

interface VercelV0ChatProps {
  onSendMessage?: (message: string) => void;
  onFileUpload?: (file: File) => void;
  onImageUpload?: (file: File) => void;
  className?: string;
}

export const VercelV0Chat: React.FC<VercelV0ChatProps> = ({
  onSendMessage,
  onFileUpload,
  onImageUpload,
  className,
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useAutoResizeTextarea(message);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage?.(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload?.(file);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload?.(file);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg border border-border bg-background p-4",
        className,
      )}
    >
      {/* Action Buttons Grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <ActionButton
          icon={<ImageIcon className="h-5 w-5" />}
          label="Image"
          onClick={() => imageInputRef.current?.click()}
        />
        <ActionButton
          icon={<FileUp className="h-5 w-5" />}
          label="Upload"
          onClick={() => fileInputRef.current?.click()}
        />
        <ActionButton
          icon={<Figma className="h-5 w-5" />}
          label="Figma"
        />
        <ActionButton
          icon={<MonitorIcon className="h-5 w-5" />}
          label="Website"
        />
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* Chat Input Area */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to build..."
            className="resize-none"
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className={cn(
            "flex items-center justify-center rounded-md bg-primary px-3 py-2 text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          <ArrowUpIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t border-border pt-3">
        <div className="flex gap-2">
          <button className="rounded-md p-2 hover:bg-accent">
            <Paperclip className="h-4 w-4" />
          </button>
          <button className="rounded-md p-2 hover:bg-accent">
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Powered by V0
          </span>
          <CircleUserRound className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};
