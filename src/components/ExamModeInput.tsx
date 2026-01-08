import { useState, useRef, useEffect } from "react";
import { Sparkles, Mic, MicOff, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import "@/types/speech-recognition.d.ts";

interface ExamModeInputProps {
  onSubmit: (plan: string) => void;
  isLoading?: boolean;
}

const ExamModeInput = ({ onSubmit, isLoading }: ExamModeInputProps) => {
  const [examDate, setExamDate] = useState("");
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [dailyHours, setDailyHours] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [examDetailsOpen, setExamDetailsOpen] = useState(true);
  const [timeAvailabilityOpen, setTimeAvailabilityOpen] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (activeField) {
          switch (activeField) {
            case "examDate":
              setExamDate(transcript);
              break;
            case "subject":
              setSubject(transcript);
              break;
            case "difficulty":
              setDifficulty(transcript);
              break;
            case "syllabus":
              setSyllabus(transcript);
              break;
            case "dailyHours":
              setDailyHours(transcript);
              break;
            case "preferredTime":
              setPreferredTime(transcript);
              break;
          }
        }
        setIsListening(false);
        setActiveField(null);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setActiveField(null);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [activeField]);

  const startListening = (field: string) => {
    if (recognitionRef.current) {
      setActiveField(field);
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setActiveField(null);
    }
  };

  const handleSubmit = () => {
    const plan = `Exam Mode Plan: Subject: ${subject}, Date: ${examDate}, Difficulty: ${difficulty}, Syllabus: ${syllabus}, Daily Hours: ${dailyHours}, Preferred Time: ${preferredTime}`;
    if (subject.trim() || examDate.trim()) {
      onSubmit(plan);
    }
  };

  const MicButton = ({ field }: { field: string }) => (
    <button
      type="button"
      onClick={() => (isListening && activeField === field ? stopListening() : startListening(field))}
      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-primary transition-colors"
    >
      {isListening && activeField === field ? (
        <MicOff className="w-4 h-4 text-destructive" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <div className="chat-input-container p-6">
      <div className="flex items-start gap-3 mb-6">
        <Sparkles className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-foreground mb-1">Let us plan your exam preparation!</p>
          <p className="text-sm text-muted-foreground"> Provide the details below to create a tailored study plan:</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exam Details */}
        <Collapsible open={examDetailsOpen} onOpenChange={setExamDetailsOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 text-primary font-medium mb-4">
            Exam Details
            <ChevronDown className={`w-4 h-4 transition-transform ${examDetailsOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3">
            <div className="relative">
              <label htmlFor="examDate" className="text-sm text-muted-foreground mb-1 block">
                Exam Date
              </label>
              <Input
                id="examDate"
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="pr-10"
              />
            </div>
            <div className="relative">
              <label htmlFor="subject" className="text-sm text-muted-foreground mb-1 block">
                Subject
              </label>
              <Input
                id="subject"
                placeholder="Enter Subject Name"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="pr-10"
              />
            </div>
            <div className="relative">
              <label htmlFor="difficulty" className="text-sm text-muted-foreground mb-1 block">
                Difficulty
              </label>
              <Select value={difficulty} onValueChange={(val) => setDifficulty(val)}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <label htmlFor="syllabus" className="text-sm text-muted-foreground mb-1 block">
                Syllabus
              </label>
              <Input
                id="syllabus"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => setSyllabus((e.target as HTMLInputElement).files?.[0]?.name || "")}
                className="pr-10"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Time Availability */}
        <Collapsible open={timeAvailabilityOpen} onOpenChange={setTimeAvailabilityOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 text-primary font-medium mb-4">
            Time Availability
            <ChevronDown className={`w-4 h-4 transition-transform ${timeAvailabilityOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3">
            <div className="relative">
              <label htmlFor="dailyHours" className="text-sm text-muted-foreground mb-1 block">
                Available Study Hours Daily
              </label>
              <Input
                id="dailyHours"
                placeholder="Enter number of hours"
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                className="pr-10"
              />
            </div>
            <div className="relative">
              <label htmlFor="preferredTime" className="text-sm text-muted-foreground mb-1 block">
                Preferred Time of Day
              </label>
              <Select value={preferredTime} onValueChange={(val) => setPreferredTime(val)}>
                <SelectTrigger id="preferredTime">
                  <SelectValue placeholder="Select preferred time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Morning">Morning</SelectItem>
                  <SelectItem value="Afternoon">Afternoon</SelectItem>
                  <SelectItem value="Evening">Evening</SelectItem>
                  <SelectItem value="Night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={(!subject.trim() && !examDate.trim()) || isLoading}
          className="px-8"
        >
          {isLoading ? "Planning..." : "Plan My Day"}
        </Button>
      </div>
    </div>
  );
};

export default ExamModeInput;
