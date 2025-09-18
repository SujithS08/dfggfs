import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LearningPersona } from '@/lib/data-processing';

interface StudentRadarChartProps {
  personas: LearningPersona[];
}

const StudentRadarChart = ({ personas }: StudentRadarChartProps) => {
  const radarData = [
    'comprehension',
    'attention', 
    'focus',
    'retention',
    'assessment_score',
    'engagement_time'
  ].map(skill => {
    const dataPoint: any = { skill: skill.charAt(0).toUpperCase() + skill.slice(1).replace('_', ' ') };
    
    personas.forEach((persona, index) => {
      dataPoint[persona.name] = persona.avgScores[skill as keyof typeof persona.avgScores];
    });
    
    return dataPoint;
  });

  const colors = [
    'hsl(var(--primary))',
    'hsl(var(--accent))',
    'hsl(var(--success))',
    'hsl(var(--warning))'
  ];

  return (
    <Card className="chart-enter">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 bg-success rounded-full"></div>
          Learning Personas Profile
        </CardTitle>
        <CardDescription>
          Cognitive skill profiles for different learning personas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis 
              dataKey="skill" 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            />
            {personas.map((persona, index) => (
              <Radar
                key={persona.id}
                name={persona.name}
                dataKey={persona.name}
                stroke={colors[index]}
                fill={colors[index]}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            ))}
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StudentRadarChart;