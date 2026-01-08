import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Circle } from "lucide-react";
import ChatInput from "@/components/ChatInput";
import ExamModeInput from "@/components/ExamModeInput";
import Confirmation from "@/components/Confirmation";
import Features from "@/components/Features";
import Header from "@/components/Header";
import About from "@/components/About";
import Footer from "@/components/Footer";

const Index = () => {
  const [confirmedPlan, setConfirmedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExamMode, setIsExamMode] = useState(false);
  const navigate = useNavigate();

  const handlePlanSubmit = (plan: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setConfirmedPlan(plan);
      setIsLoading(false);
      setTimeout(() => {
        navigate("/dashboard", { state: { plan } });
      }, 1500);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Header with Logo and Mode Toggle */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Circle className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-foreground">
                    Dincharya — Your calm, AI study companion
                  </h1>
                  {isExamMode && (
                    <p className="text-muted-foreground text-sm">Welcome to Exam Mode</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsExamMode(!isExamMode)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isExamMode ? "Go to Default Mode" : "Go to Exam Mode"}
              </button>
            </div>

            {!isExamMode && (
              <p className="text-muted-foreground mb-8">
                Effortlessly organize your academic and personal life.
              </p>
            )}
            
            {isExamMode ? (
              <ExamModeInput onSubmit={handlePlanSubmit} isLoading={isLoading} />
            ) : (
              <ChatInput onSubmit={handlePlanSubmit} isLoading={isLoading} />
            )}
            
            {confirmedPlan && (
              <div className="mt-8">
                <Confirmation plan={confirmedPlan} />
              </div>
            )}
          </div>
        </section>
        
        <Features />
        <About />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;