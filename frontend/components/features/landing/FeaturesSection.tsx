import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClipboardList, Users, CheckCircle } from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "Task Management",
    description:
      "Create, organize, and track tasks with ease. Set priorities, due dates, and monitor progress.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Work together seamlessly. Assign tasks, share updates, and keep everyone on the same page.",
  },
  {
    icon: CheckCircle,
    title: "Progress Tracking",
    description:
      "Visualize your progress with boards and analytics. Stay motivated and achieve more.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-muted/30 scroll-mt-16 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Everything You Need to Stay Productive
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Powerful features to help you manage tasks, collaborate with team,
            and achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <feature.icon className="text-primary h-6 w-6" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
