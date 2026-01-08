import { Clock, Brain, RefreshCw, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Saves Time",
    description: "Automate tedious scheduling, freeing up precious hours for studying and leisure activities.",
  },
  {
    icon: Brain,
    title: "Reduces Stress",
    description: "Gain clarity and control over your daily tasks, eliminating anxiety about missed deadlines.",
  },
  {
    icon: RefreshCw,
    title: "Automates Planning",
    description: "Intelligent algorithms create optimized schedules based on your goals and commitments.",
  },
  {
    icon: BarChart3,
    title: "Tracks Habits",
    description: "Effortlessly monitor your progress on key habits, building consistency and healthy routines.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-3 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-foreground mb-12">
          Why Dincharya?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border border border-border rounded-lg">
          {features.map((feature, index) => (
            <div key={index} className="feature-card p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
