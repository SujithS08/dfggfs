import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentAnalytics } from '@/lib/data-processing';
import { TrendingUp, Users, BookOpen, Brain, Clock, Target } from 'lucide-react';

interface StatsOverviewProps {
  analytics: StudentAnalytics;
}

const StatsOverview = ({ analytics }: StatsOverviewProps) => {
  const stats = [
    {
      title: 'Total Students',
      value: analytics.totalStudents,
      icon: Users,
      description: 'Active learners',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Average Score',
      value: `${analytics.avgScore}%`,
      icon: Target,
      description: 'Assessment performance',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Comprehension',
      value: `${analytics.avgComprehension}%`,
      icon: BookOpen,
      description: 'Understanding level',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Attention',
      value: `${analytics.avgAttention}%`,
      icon: Brain,
      description: 'Focus capability',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Retention',
      value: `${analytics.avgRetention}%`,
      icon: TrendingUp,
      description: 'Memory strength',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Engagement',
      value: `${analytics.avgEngagement}min`,
      icon: Clock,
      description: 'Study time',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-full`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsOverview;