import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentData } from '@/lib/data-processing';

interface AttentionScatterChartProps {
  data: StudentData[];
}

const AttentionScatterChart = ({ data }: AttentionScatterChartProps) => {
  const scatterData = data.map(student => ({
    attention: student.attention,
    assessment_score: student.assessment_score,
    name: student.name,
    class: student.class,
  }));

  const getColorByClass = (className: string) => {
    const colors = {
      'Class A': 'hsl(var(--primary))',
      'Class B': 'hsl(var(--accent))',
      'Class C': 'hsl(var(--success))',
      'Class D': 'hsl(var(--warning))',
    };
    return colors[className as keyof typeof colors] || 'hsl(var(--muted))';
  };

  return (
    <Card className="chart-enter">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 bg-accent rounded-full"></div>
          Attention vs Assessment Performance
        </CardTitle>
        <CardDescription>
          Relationship between attention levels and assessment scores by class
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            data={scatterData}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number" 
              dataKey="attention" 
              name="Attention"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              type="number" 
              dataKey="assessment_score" 
              name="Assessment Score"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string) => [
                `${value}`,
                name === 'attention' ? 'Attention Level' : 'Assessment Score'
              ]}
              labelFormatter={(_, payload) => {
                if (payload && payload[0]) {
                  const data = payload[0].payload;
                  return `${data.name} (${data.class})`;
                }
                return '';
              }}
            />
            <Scatter name="Students" data={scatterData} fill="hsl(var(--primary))">
              {scatterData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColorByClass(entry.class)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Class A</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span>Class B</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span>Class C</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span>Class D</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttentionScatterChart;