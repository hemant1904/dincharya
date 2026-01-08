import { useState, useRef, useEffect } from "react";
import { Sparkles, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import "@/types/speech-recognition.d.ts";

interface ChatInputProps {
  onSubmit: (plan: string) => void;
  isLoading?: boolean;
}

const ChatInput = ({ onSubmit, isLoading }: ChatInputProps) => {
  const [plan, setPlan] = useState("");
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setPlan(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [plan]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSubmit = () => {
    if (plan.trim()) {
      onSubmit(plan.trim());
      setPlan("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-input-container p-4">
      <div className="flex items-start gap-3 mb-4">
        <Sparkles className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-foreground mb-1">Tell me what to schedule today!</p>
          <p className="text-sm text-muted-foreground">
            e.g: 'Plan for my Mathematics exam on Nov 10, including Coordinate Geometry and Integration topics. Also, schedule gym for three times a week and allocate time for reading.'
          </p>
        </div>
      </div>
      
      <div className="relative mb-4">
        <Textarea
          ref={textareaRef}
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your day plans here..."
          rows={1}
          className="h-auto min-h-0 pr-12 resize-none border-border focus-visible:ring-primary"
        />
        <button
          type="button"
          onClick={toggleListening}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-accent transition-colors flex items-center justify-center"
          aria-label="Toggle microphone"
        >
          {isListening ? (
            <MicOff className="w-5 h-5 text-destructive" />
          ) : (
            <Mic className="w-5 h-5 text-muted-foreground hover:text-primary" />
          )}
        </button>
      </div>
      
      <div className="mt-6 flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={!plan.trim() || isLoading}
          className="px-8"
        >
          {isLoading ? "Planning..." : "Plan My Day"}
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
