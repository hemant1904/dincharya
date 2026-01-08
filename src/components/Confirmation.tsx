import { CheckCircle2 } from "lucide-react";

interface ConfirmationProps {
  plan: string;
}

const Confirmation = ({ plan }: ConfirmationProps) => {
  // Extract key activities from the plan for display
  const extractActivities = (text: string): string => {
    const words = text.toLowerCase();
    const activities: string[] = [];
    
    if (words.includes("study") || words.includes("exam") || words.includes("calculus") || words.includes("algebra")) {
      activities.push("study");
    }
    if (words.includes("gym") || words.includes("exercise") || words.includes("workout")) {
      activities.push("gym");
    }
    if (words.includes("reading") || words.includes("book")) {
      activities.push("reading");
    }
    if (words.includes("meeting") || words.includes("project")) {
      activities.push("meetings");
    }
    if (words.includes("prep") || words.includes("preparation")) {
      activities.push("exam prep");
    }
    
    if (activities.length === 0) {
      return "your planned activities";
    }
    
    if (activities.length === 1) {
      return activities[0];
    }
    
    const last = activities.pop();
    return `${activities.join(", ")}, and ${last}`;
  };

  return (
    <div className="confirmation-card animate-slide-up">
      <div className="flex justify-center mb-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center animate-check-pop">
          <CheckCircle2 className="w-6 h-6 text-primary" />
        </div>
      </div>
      <h3 className="font-semibold text-foreground mb-2">Plan Confirmed!</h3>
      <p className="text-sm text-muted-foreground">
        Your day is scheduled with {extractActivities(plan)}. Good luck!
      </p>
    </div>
  );
};

export default Confirmation;
