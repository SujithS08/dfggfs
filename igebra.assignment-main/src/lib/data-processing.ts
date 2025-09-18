export interface StudentData {
  student_id: string;
  name: string;
  class: string;
  comprehension: number;
  attention: number;
  focus: number;
  retention: number;
  assessment_score: number;
  engagement_time: number;
}

export interface StudentAnalytics {
  avgScore: number;
  avgComprehension: number;
  avgAttention: number;
  avgFocus: number;
  avgRetention: number;
  avgEngagement: number;
  totalStudents: number;
  classDistribution: Record<string, number>;
}

export interface LearningPersona {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  students: StudentData[];
  avgScores: {
    comprehension: number;
    attention: number;
    focus: number;
    retention: number;
    assessment_score: number;
    engagement_time: number;
  };
}

export class StudentDataProcessor {
  private data: StudentData[] = [];

  constructor(csvText: string) {
    this.parseCSV(csvText);
  }

  private parseCSV(csvText: string): void {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    
    this.data = lines.slice(1).map(line => {
      const values = line.split(',');
      return {
        student_id: values[0],
        name: values[1],
        class: values[2],
        comprehension: parseFloat(values[3]),
        attention: parseFloat(values[4]),
        focus: parseFloat(values[5]),
        retention: parseFloat(values[6]),
        assessment_score: parseFloat(values[7]),
        engagement_time: parseFloat(values[8])
      };
    });
  }

  getStudentData(): StudentData[] {
    return this.data;
  }

  getAnalytics(): StudentAnalytics {
    const total = this.data.length;
    
    const classDistribution = this.data.reduce((acc, student) => {
      acc[student.class] = (acc[student.class] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      avgScore: this.average('assessment_score'),
      avgComprehension: this.average('comprehension'),
      avgAttention: this.average('attention'),
      avgFocus: this.average('focus'),
      avgRetention: this.average('retention'),
      avgEngagement: this.average('engagement_time'),
      totalStudents: total,
      classDistribution
    };
  }

  private average(field: keyof StudentData): number {
    const sum = this.data.reduce((acc, student) => acc + (student[field] as number), 0);
    return Math.round((sum / this.data.length) * 100) / 100;
  }

  getCorrelations(): Record<string, number> {
    const skills = ['comprehension', 'attention', 'focus', 'retention', 'engagement_time'];
    const correlations: Record<string, number> = {};

    skills.forEach(skill => {
      correlations[skill] = this.correlation(skill as keyof StudentData, 'assessment_score');
    });

    return correlations;
  }

  private correlation(x: keyof StudentData, y: keyof StudentData): number {
    const n = this.data.length;
    const xValues = this.data.map(d => d[x] as number);
    const yValues = this.data.map(d => d[y] as number);
    
    const xMean = xValues.reduce((a, b) => a + b, 0) / n;
    const yMean = yValues.reduce((a, b) => a + b, 0) / n;
    
    const numerator = xValues.reduce((acc, xi, i) => acc + (xi - xMean) * (yValues[i] - yMean), 0);
    const xSumSq = xValues.reduce((acc, xi) => acc + Math.pow(xi - xMean, 2), 0);
    const ySumSq = yValues.reduce((acc, yi) => acc + Math.pow(yi - yMean, 2), 0);
    
    return Math.round((numerator / Math.sqrt(xSumSq * ySumSq)) * 100) / 100;
  }

  getLearningPersonas(): LearningPersona[] {
    // K-means clustering simulation for learning personas
    const personas: LearningPersona[] = [
      {
        id: 'high-performers',
        name: 'High Performers',
        description: 'Students with excellent overall cognitive skills and high assessment scores',
        characteristics: ['High comprehension', 'Strong attention', 'Excellent retention', 'High scores'],
        students: [],
        avgScores: { comprehension: 0, attention: 0, focus: 0, retention: 0, assessment_score: 0, engagement_time: 0 }
      },
      {
        id: 'focused-learners',
        name: 'Focused Learners',
        description: 'Students with strong focus and attention but moderate comprehension',
        characteristics: ['Excellent focus', 'Good attention', 'Moderate comprehension', 'Consistent performance'],
        students: [],
        avgScores: { comprehension: 0, attention: 0, focus: 0, retention: 0, assessment_score: 0, engagement_time: 0 }
      },
      {
        id: 'struggling-students',
        name: 'Struggling Students',
        description: 'Students who need additional support across multiple cognitive areas',
        characteristics: ['Low comprehension', 'Attention challenges', 'Lower retention', 'Need support'],
        students: [],
        avgScores: { comprehension: 0, attention: 0, focus: 0, retention: 0, assessment_score: 0, engagement_time: 0 }
      },
      {
        id: 'inconsistent-performers',
        name: 'Inconsistent Performers',
        description: 'Students with mixed cognitive skills and variable performance',
        characteristics: ['Variable skills', 'Inconsistent scores', 'Potential for growth', 'Need targeted help'],
        students: [],
        avgScores: { comprehension: 0, attention: 0, focus: 0, retention: 0, assessment_score: 0, engagement_time: 0 }
      }
    ];

    // Simple clustering based on assessment scores and cognitive skills
    this.data.forEach(student => {
      const avgCognitive = (student.comprehension + student.attention + student.focus + student.retention) / 4;
      
      if (student.assessment_score >= 80 && avgCognitive >= 75) {
        personas[0].students.push(student);
      } else if (student.focus >= 70 && student.attention >= 70) {
        personas[1].students.push(student);
      } else if (student.assessment_score < 60 || avgCognitive < 60) {
        personas[2].students.push(student);
      } else {
        personas[3].students.push(student);
      }
    });

    // Calculate average scores for each persona
    personas.forEach(persona => {
      if (persona.students.length > 0) {
        persona.avgScores = {
          comprehension: this.averageForGroup(persona.students, 'comprehension'),
          attention: this.averageForGroup(persona.students, 'attention'),
          focus: this.averageForGroup(persona.students, 'focus'),
          retention: this.averageForGroup(persona.students, 'retention'),
          assessment_score: this.averageForGroup(persona.students, 'assessment_score'),
          engagement_time: this.averageForGroup(persona.students, 'engagement_time')
        };
      }
    });

    return personas.filter(persona => persona.students.length > 0);
  }

  private averageForGroup(students: StudentData[], field: keyof StudentData): number {
    const sum = students.reduce((acc, student) => acc + (student[field] as number), 0);
    return Math.round((sum / students.length) * 100) / 100;
  }

  predictPerformance(student: StudentData): {
    predictedScore: number;
    confidence: string;
    recommendations: string[];
  } {
    // Simple linear regression model simulation
    const weights = {
      comprehension: 0.35,
      attention: 0.25,
      focus: 0.20,
      retention: 0.15,
      engagement_time: 0.05
    };

    const predictedScore = Math.round(
      (student.comprehension * weights.comprehension +
       student.attention * weights.attention +
       student.focus * weights.focus +
       student.retention * weights.retention +
       student.engagement_time * weights.engagement_time) * 100
    ) / 100;

    const confidence = predictedScore > 85 ? 'High' : predictedScore > 65 ? 'Medium' : 'Low';
    
    const recommendations: string[] = [];
    
    if (student.comprehension < 70) recommendations.push('Focus on reading comprehension exercises');
    if (student.attention < 70) recommendations.push('Implement attention-building activities');
    if (student.focus < 70) recommendations.push('Use mindfulness and concentration techniques');
    if (student.retention < 70) recommendations.push('Practice spaced repetition and memory techniques');
    if (student.engagement_time < 30) recommendations.push('Increase interactive learning time');

    return { predictedScore, confidence, recommendations };
  }
}