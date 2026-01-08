const About = () => {
  return (
    <section id="about" className="py-16 bg-secondary/30 border-t border-border">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl font-bold text-foreground mb-8">About Dincharya</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Our Purpose</h3>
            <p className="text-muted-foreground leading-relaxed">
              Dincharya is designed to empower individuals by simplifying daily planning and habit formation. Our goal is to help you achieve a balanced and productive lifestyle without the overwhelm, by integrating smart scheduling with intuitive habit tracking.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-2">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              We envision a future where everyone has the tools to effortlessly manage their time and cultivate positive habits, leading to greater well-being and success. Dincharya strives to be the indispensable companion in your journey towards personal mastery.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-2">AI-Driven Automation</h3>
            <p className="text-muted-foreground leading-relaxed">
              Leveraging cutting-edge AI, Dincharya intelligently analyzes your tasks, commitments, and habits to create optimized daily schedules. From identifying ideal study blocks to reminding you about gym sessions, our AI ensures your day flows smoothly, adapting to your evolving needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
