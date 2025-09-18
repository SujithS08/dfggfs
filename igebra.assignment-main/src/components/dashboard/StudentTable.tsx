import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StudentData } from '@/lib/data-processing';
import { Search, ArrowUpDown, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface StudentTableProps {
  students: StudentData[];
  onStudentSelect?: (student: StudentData) => void;
}

const StudentTable = ({ students, onStudentSelect }: StudentTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof StudentData;
    direction: 'asc' | 'desc';
  } | null>(null);

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' 
            ? aValue - bValue 
            : bValue - aValue;
        }
        
        return 0;
      });
    }

    return filtered;
  }, [students, searchTerm, sortConfig]);

  const handleSort = (key: keyof StudentData) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-success text-success-foreground">Excellent</Badge>;
    if (score >= 80) return <Badge className="bg-primary text-primary-foreground">Good</Badge>;
    if (score >= 70) return <Badge className="bg-warning text-warning-foreground">Average</Badge>;
    return <Badge variant="destructive">Needs Support</Badge>;
  };

  const StudentDetailDialog = ({ student }: { student: StudentData }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{student.name} - Detailed Profile</DialogTitle>
          <DialogDescription>
            Comprehensive view of student performance and cognitive skills
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Basic Information</h4>
              <div className="mt-2 space-y-1">
                <p><span className="font-medium">ID:</span> {student.student_id}</p>
                <p><span className="font-medium">Class:</span> {student.class}</p>
                <p><span className="font-medium">Assessment Score:</span> {student.assessment_score}%</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Performance</h4>
              <div className="mt-2">
                {getPerformanceBadge(student.assessment_score)}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Cognitive Skills</h4>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span>Comprehension</span>
                  <span className="font-medium">{student.comprehension}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Attention</span>
                  <span className="font-medium">{student.attention}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Focus</span>
                  <span className="font-medium">{student.focus}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Retention</span>
                  <span className="font-medium">{student.retention}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Engagement Time</span>
                  <span className="font-medium">{student.engagement_time} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 bg-accent rounded-full"></div>
          Student Performance Table
        </CardTitle>
        <CardDescription>
          Searchable and sortable view of all student data
        </CardDescription>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Badge variant="outline">
            {filteredAndSortedStudents.length} of {students.length} students
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('name')} className="h-auto p-0 font-medium">
                    Student <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('class')} className="h-auto p-0 font-medium">
                    Class <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('assessment_score')} className="h-auto p-0 font-medium">
                    Score <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('comprehension')} className="h-auto p-0 font-medium">
                    Comprehension <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('attention')} className="h-auto p-0 font-medium">
                    Attention <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedStudents.map((student) => (
                <TableRow key={student.student_id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.student_id}</div>
                    </div>
                  </TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell className="font-medium">{student.assessment_score}%</TableCell>
                  <TableCell>{student.comprehension}%</TableCell>
                  <TableCell>{student.attention}%</TableCell>
                  <TableCell>{getPerformanceBadge(student.assessment_score)}</TableCell>
                  <TableCell>
                    <StudentDetailDialog student={student} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentTable;