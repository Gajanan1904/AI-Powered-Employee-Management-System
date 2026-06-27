export const mockEmployees = [
  {
    id: 'EMP001',
    name: 'Gajanan Bidwai',
    email: 'gajanan.bidwai@enterprise.com',
    department: 'HR',
    designation: 'Chief HR Officer',
    status: 'Absent',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
    joinDate: '2022-03-15',
    attendanceRate: 98.4,
    teamwork: 92,
    communication: 88,
    innovation: 96,
    taskCompletion: 95,
    rewardPoints: 2450,
    badges: ['Innovator', 'Team Pillar', 'Speedster'],
    performanceScore: 93,
    churnRisk: 4.2,
    promotionProbability: 92.5
  },
  {
    id: 'EMP002',
    name: 'Elena Rostova',
    email: 'elena.r@enterprise.com',
    department: 'Product',
    designation: 'Senior Product Manager',
    status: 'Present',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    joinDate: '2023-01-10',
    attendanceRate: 95.8,
    teamwork: 90,
    communication: 95,
    innovation: 90,
    taskCompletion: 89,
    rewardPoints: 1820,
    badges: ['Client Magnet', 'Idea Spark'],
    performanceScore: 91,
    churnRisk: 8.5,
    promotionProbability: 84.0
  },
  {
    id: 'EMP003',
    name: 'Amina Diallo',
    email: 'amina.d@enterprise.com',
    department: 'Marketing',
    designation: 'Lead Growth Strategist',
    status: 'Present',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    joinDate: '2023-06-22',
    attendanceRate: 91.2,
    teamwork: 85,
    communication: 92,
    innovation: 94,
    taskCompletion: 87,
    rewardPoints: 1640,
    badges: ['Creative Genius', 'Rising Star'],
    performanceScore: 89,
    churnRisk: 12.1,
    promotionProbability: 78.4
  },
  {
    id: 'EMP004',
    name: 'Jin-Woo Park',
    email: 'jinwoo.p@enterprise.com',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    status: 'Absent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    joinDate: '2023-11-01',
    attendanceRate: 94.5,
    teamwork: 88,
    communication: 80,
    innovation: 85,
    taskCompletion: 92,
    rewardPoints: 1100,
    badges: ['Speedster'],
    performanceScore: 86,
    churnRisk: 15.6,
    promotionProbability: 62.0
  },
  {
    id: 'EMP005',
    name: 'Chloe Tremblay',
    email: 'chloe.t@enterprise.com',
    department: 'HR',
    designation: 'Talent Acquisition Partner',
    status: 'Present',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
    joinDate: '2024-02-15',
    attendanceRate: 99.2,
    teamwork: 95,
    communication: 98,
    innovation: 80,
    taskCompletion: 90,
    rewardPoints: 1950,
    badges: ['Culture Champion', 'Team Pillar'],
    performanceScore: 91,
    churnRisk: 2.5,
    promotionProbability: 88.0
  },
  {
    id: 'EMP006',
    name: 'Devon Carter',
    email: 'devon.c@enterprise.com',
    department: 'Sales',
    designation: 'Enterprise Account Executive',
    status: 'Present',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120',
    joinDate: '2022-09-01',
    attendanceRate: 88.0,
    teamwork: 78,
    communication: 96,
    innovation: 82,
    taskCompletion: 80,
    rewardPoints: 1400,
    badges: ['Client Magnet'],
    performanceScore: 84,
    churnRisk: 28.4,
    promotionProbability: 45.0
  },
  {
    id: 'EMP007',
    name: 'Marcus Aurelius',
    email: 'marcus.a@enterprise.com',
    department: 'Engineering',
    designation: 'Principal Architect',
    status: 'Present',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    joinDate: '2024-04-10',
    attendanceRate: 97.6,
    teamwork: 90,
    communication: 85,
    innovation: 78,
    taskCompletion: 91,
    rewardPoints: 850,
    badges: ['Rising Star'],
    performanceScore: 86,
    churnRisk: 5.8,
    promotionProbability: 58.0
  },
  {
    id: 'EMP008',
    name: 'Sanjay Mehta',
    email: 'sanjay.m@enterprise.com',
    department: 'Finance',
    designation: 'Senior Financial Analyst',
    status: 'Present',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120',
    joinDate: '2021-07-20',
    attendanceRate: 96.5,
    teamwork: 82,
    communication: 86,
    innovation: 80,
    taskCompletion: 94,
    rewardPoints: 1550,
    badges: ['Precision Master'],
    performanceScore: 88,
    churnRisk: 9.2,
    promotionProbability: 72.0
  }
];

export const mockRecentActivities = [
  {
    id: 'ACT001',
    type: 'attendance',
    text: 'Elena Rostova checked in via Face Recognition at 08:52 AM.',
    time: '2 hours ago'
  },
  {
    id: 'ACT002',
    type: 'reward',
    text: 'Marcus Aurelius unlocked the "Innovator" Badge after custom evaluations.',
    time: '4 hours ago'
  },
  {
    id: 'ACT003',
    type: 'performance',
    text: 'Amina Diallo completed the Q2 Performance Review with a score of 89%.',
    time: '1 day ago'
  },
  {
    id: 'ACT004',
    type: 'ai',
    text: 'AI predictive engine flagged Devon Carter as high churn risk (28.4%).',
    time: '1 day ago'
  },
  {
    id: 'ACT005',
    type: 'system',
    text: 'New employee Sarah Jenkins added to the Engineering department.',
    time: '2 days ago'
  }
];

export const mockAIHistory = [
  {
    id: 'PRED001',
    employeeName: 'Marcus Aurelius',
    department: 'Engineering',
    score: 93,
    promotionProbability: 92.5,
    churnRisk: 4.2,
    timestamp: '2026-05-24 10:15 AM'
  },
  {
    id: 'PRED002',
    employeeName: 'Devon Carter',
    department: 'Sales',
    score: 84,
    promotionProbability: 45.0,
    churnRisk: 28.4,
    timestamp: '2026-05-23 04:30 PM'
  },
  {
    id: 'PRED003',
    employeeName: 'Amina Diallo',
    department: 'Marketing',
    score: 89,
    promotionProbability: 78.4,
    churnRisk: 12.1,
    timestamp: '2026-05-22 09:12 AM'
  }
];

export const mockBadgesList = [
  { name: 'Innovator', icon: '💡', description: 'Exceptional creativity & solution building' },
  { name: 'Team Pillar', icon: '🤝', description: 'Excellent collaborative & peer support reviews' },
  { name: 'Speedster', icon: '⚡', description: 'Extremely fast task completion with high accuracy' },
  { name: 'Client Magnet', icon: '🎯', description: 'Top relationships & accounts retainer' },
  { name: 'Precision Master', icon: '📊', description: 'Zero error analytics & budget alignment' },
  { name: 'Culture Champion', icon: '🌟', description: 'Fosters team spirit and cross-team engagement' },
  { name: 'Rising Star', icon: '🚀', description: 'Fast growth rate within first year of joining' },
  { name: 'Idea Spark', icon: '✨', description: 'Proactive initiatives for company improvement' }
];
