import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SkillsBarChartProps {
  data: Array<{
    skill: string;
    avgScore: number;
    correlation: number;
  }>;
}

const SkillsBarChart = ({ data }: SkillsBarChartProps) => {
  return (
    <Card className="chart-enter">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          Cognitive Skills vs Performance
        </CardTitle>
        <CardDescription>
          Average skill scores and their correlation with assessment performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="skill" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string) => [
                `${value}${name === 'correlation' ? '' : ''}`,
                name === 'avgScore' ? 'Average Score' : 'Correlation'
              ]}
            />
            <Legend />
            <Bar 
              dataKey="avgScore" 
              fill="hsl(var(--primary))" 
              name="Average Score"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="correlation" 
              fill="hsl(var(--accent))" 
              name="Correlation"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SkillsBarChart;