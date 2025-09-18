import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StudentData, StudentDataProcessor, LearningPersona } from '@/lib/data-processing';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Users, Target } from 'lucide-react';
import { useState } from 'react';

interface AIInsightsProps {
  students: StudentData[];
  processor: StudentDataProcessor;
  personas: LearningPersona[];
}

const AIInsights = ({ students, processor, personas }: AIInsightsProps) => {
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const correlations = processor.getCorrelations();
  
  // Generate key insights
  const insights = [
    {
      type: 'correlation',
      icon: TrendingUp,
      title: 'Strongest Predictor',
      description: `${Object.entries(correlations).reduce((a, b) => 
        Math.abs(correlations[a[0]]) > Math.abs(b[1]) ? a : b
      )[0]} shows the highest correlation (${Math.max(...Object.values(correlations).map(Math.abs)).toFixed(2)}) with assessment scores`,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      type: 'persona',
      icon: Users,
      title: 'Learning Personas',
      description: `${personas.length} distinct learning personas identified. ${personas[0]?.name} group has ${personas[0]?.students.length} students with highest performance.`,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      type: 'at-risk',
      icon: AlertTriangle,
      title: 'Students at Risk',
      description: `${students.filter(s => s.assessment_score < 60).length} students scoring below 60% need immediate attention and support.`,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      type: 'opportunity',
      icon: Lightbulb,
      title: 'Improvement Opportunity',
      description: `Focus on ${Object.entries(correlations).sort((a, b) => b[1] - a[1])[0][0]} training to maximize score improvements across all students.`,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  const generatePersonalizedInsight = (student: StudentData) => {
    const prediction = processor.predictPerformance(student);
    const weakestSkill = Object.entries({
      comprehension: student.comprehension,
      attention: student.attention,
      focus: student.focus,
      retention: student.retention
    }).sort((a, b) => a[1] - b[1])[0];

    return {
      student,
      prediction,
      weakestSkill: weakestSkill[0],
      weakestScore: weakestSkill[1],
      persona: personas.find(p => p.students.some(s => s.student_id === student.student_id))?.name || 'Unknown'
    };
  };

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>
            Machine learning analysis of student performance patterns and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg border">
                  <div className={`${insight.bgColor} p-2 rounded-full flex-shrink-0`}>
                    <Icon className={`h-4 w-4 ${insight.color}`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Personalized Student Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            Personalized Student Analysis
          </CardTitle>
          <CardDescription>
            AI-generated insights and recommendations for individual students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {students.slice(0, 10).map(student => (
                <Button
                  key={student.student_id}
                  variant={selectedStudent?.student_id === student.student_id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStudent(student)}
                >
                  {student.name.split(' ')[0]}
                </Button>
              ))}
            </div>

            {selectedStudent && (
              <div className="p-4 border rounded-lg bg-muted/30">
                {(() => {
                  const insight = generatePersonalizedInsight(selectedStudent);
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{insight.student.name}</h4>
                        <Badge variant="outline">{insight.persona}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Performance Prediction</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Predicted Score:</span>
                              <span className="font-medium">{insight.prediction.predictedScore}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Confidence:</span>
                              <Badge variant={insight.prediction.confidence === 'High' ? 'default' : 
                                            insight.prediction.confidence === 'Medium' ? 'secondary' : 'destructive'}>
                                {insight.prediction.confidence}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Area of Focus:</span>
                              <span className="font-medium capitalize">{insight.weakestSkill}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium text-muted-foreground mb-2">AI Recommendations</h5>
                          <ul className="space-y-1 text-sm">
                            {insight.prediction.recommendations.map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Learning Personas Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-success" />
            Learning Personas Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {personas.map((persona, index) => (
              <div key={persona.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{persona.name}</h4>
                  <Badge variant="outline">{persona.students.length}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{persona.description}</p>
                <div className="space-y-1">
                  {persona.characteristics.slice(0, 2).map((char, idx) => (
                    <div key={idx} className="text-xs flex items-center gap-1">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      {char}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsights;