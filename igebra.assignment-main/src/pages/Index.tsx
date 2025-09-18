import { useState, useEffect } from 'react';
import { StudentDataProcessor, StudentData, StudentAnalytics, LearningPersona } from '@/lib/data-processing';
import StatsOverview from '@/components/dashboard/StatsOverview';
import SkillsBarChart from '@/components/charts/SkillsBarChart';
import AttentionScatterChart from '@/components/charts/AttentionScatterChart';
import StudentRadarChart from '@/components/charts/RadarChart';
import StudentTable from '@/components/dashboard/StudentTable';
import AIInsights from '@/components/dashboard/AIInsights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, BarChart3, Users, Brain, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [analytics, setAnalytics] = useState<StudentAnalytics | null>(null);
  const [personas, setPersonas] = useState<LearningPersona[]>([]);
  const [processor, setProcessor] = useState<StudentDataProcessor | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/student_dataset.csv');
        const csvText = await response.text();
        
        const dataProcessor = new StudentDataProcessor(csvText);
        const studentData = dataProcessor.getStudentData();
        const analyticsData = dataProcessor.getAnalytics();
        const personasData = dataProcessor.getLearningPersonas();
        
        setStudents(studentData);
        setAnalytics(analyticsData);
        setPersonas(personasData);
        setProcessor(dataProcessor);
        
        toast({
          title: "Data Loaded Successfully",
          description: `Analyzed ${studentData.length} students across ${Object.keys(analyticsData.classDistribution).length} classes`,
        });
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error Loading Data",
          description: "Failed to load student dataset. Please check the file.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-xl font-semibold">Loading Student Analytics...</h2>
          <p className="text-muted-foreground">Processing cognitive skills and performance data</p>
        </div>
      </div>
    );
  }

  if (!analytics || !processor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-destructive">Error Loading Data</h1>
          <p className="text-xl text-muted-foreground">Unable to process student dataset</p>
        </div>
      </div>
    );
  }

  const correlations = processor.getCorrelations();
  const skillsChartData = Object.entries(correlations).map(([skill, correlation]) => ({
    skill,
    avgScore: analytics[`avg${skill.charAt(0).toUpperCase() + skill.slice(1)}` as keyof StudentAnalytics] as number || 0,
    correlation: Math.abs(correlation)
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="gradient-primary p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Student Performance Dashboard</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Educational Analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:flex">
                <Brain className="h-3 w-3 mr-1" />
                ML Insights Enabled
              </Badge>
              <Badge variant="outline">
                {analytics.totalStudents} Students
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Stats Overview */}
        <section>
          <StatsOverview analytics={analytics} />
        </section>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="personas" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Personas</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Students</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <SkillsBarChart data={skillsChartData} />
              <AttentionScatterChart data={students} />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <SkillsBarChart data={skillsChartData} />
              <AttentionScatterChart data={students} />
              <Card>
                <CardHeader>
                  <CardTitle>Class Distribution</CardTitle>
                  <CardDescription>Number of students per class</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(analytics.classDistribution).map(([className, count]) => (
                      <div key={className} className="flex items-center gap-2">
                        <Badge variant="outline">{className}</Badge>
                        <span className="text-sm text-muted-foreground">{count} students</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="personas" className="space-y-6">
            <StudentRadarChart personas={personas} />
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <StudentTable students={students} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <AIInsights students={students} processor={processor} personas={personas} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
