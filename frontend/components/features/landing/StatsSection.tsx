export default function StatsSection() {
  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "50K+", label: "Tasks Created" },
    { value: "95%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <section id="stats" className="scroll-mt-16 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-primary text-4xl font-bold">
                {stat.value}
              </div>
              <p className="text-muted-foreground mt-1 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
