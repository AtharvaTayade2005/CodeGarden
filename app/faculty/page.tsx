import { Metadata } from 'next';
import FacultyDashboard from '@/components/FacultyDashboard';

export const metadata: Metadata = {
  title: 'Faculty Dashboard & LMS Export | Code Garden',
  description:
    'Summary dashboard for college professors to aggregate student metrics, monitor North Star Weekly Bugs Conquered, hint dependency ratios, and export continuous assessment sheets for university LMS.',
};

export default function FacultyPage() {
  return <FacultyDashboard />;
}
