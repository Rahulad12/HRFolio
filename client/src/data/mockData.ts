import { 
  Candidate, 
  Interview, 
  Assessment, 
  AssessmentAssignment,
  Interviewer,
  OfferLetter,
  EmailTemplate,
  MetricsData
} from '../types';

// Mock Candidates
export const candidates: Candidate[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    position: 'Frontend Developer',
    status: 'interviewing',
    resume: 'https://example.com/resume/john-doe',
    appliedDate: '2025-03-10',
    notes: 'Strong React skills, good cultural fit'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    position: 'UX Designer',
    status: 'assessment',
    resume: 'https://example.com/resume/jane-smith',
    appliedDate: '2025-03-12',
    notes: 'Impressive portfolio, 5 years experience'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    phone: '(555) 234-5678',
    position: 'Backend Developer',
    status: 'new',
    resume: 'https://example.com/resume/robert-johnson',
    appliedDate: '2025-03-15',
    notes: 'Good Node.js experience'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '(555) 345-6789',
    position: 'Product Manager',
    status: 'offered',
    resume: 'https://example.com/resume/emily-davis',
    appliedDate: '2025-03-01',
    notes: 'Great leadership skills, coming from a competitor'
  },
  {
    id: '5',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    phone: '(555) 456-7890',
    position: 'Data Scientist',
    status: 'screening',
    resume: 'https://example.com/resume/michael-chen',
    appliedDate: '2025-03-14',
    notes: 'PhD in Computer Science, impressive research background'
  }
];

// Mock Interviews
export const interviews: Interview[] = [
  {
    id: '1',
    candidateId: '1',
    interviewerId: '2',
    date: '2025-03-20',
    time: '10:00 AM',
    type: 'video',
    status: 'scheduled'
  },
  {
    id: '2',
    candidateId: '2',
    interviewerId: '1',
    date: '2025-03-18',
    time: '2:00 PM',
    type: 'onsite',
    status: 'completed',
    feedback: 'Strong design skills, good communication',
    rating: 4
  },
  {
    id: '3',
    candidateId: '4',
    interviewerId: '3',
    date: '2025-03-15',
    time: '11:30 AM',
    type: 'video',
    status: 'completed',
    feedback: 'Excellent product knowledge and leadership potential',
    rating: 5
  }
];

// Mock Assessments
export const assessments: Assessment[] = [
  {
    id: '1',
    title: 'Frontend Coding Challenge',
    description: 'Build a simple React application following the provided requirements',
    type: 'technical',
    duration: 120
  },
  {
    id: '2',
    title: 'UX Design Challenge',
    description: 'Create wireframes and prototype for a mobile app feature',
    type: 'technical',
    duration: 180
  },
  {
    id: '3',
    title: 'Leadership Scenario',
    description: 'Respond to a case study about managing a challenging team situation',
    type: 'behavioral',
    duration: 60
  }
];

// Mock Assessment Assignments
export const assessmentAssignments: AssessmentAssignment[] = [
  {
    id: '1',
    candidateId: '1',
    assessmentId: '1',
    assignedDate: '2025-03-15',
    dueDate: '2025-03-17',
    status: 'completed',
    score: 85,
    feedback: 'Good code quality, but missing some error handling'
  },
  {
    id: '2',
    candidateId: '2',
    assessmentId: '2',
    assignedDate: '2025-03-14',
    dueDate: '2025-03-16',
    status: 'assigned'
  }
];

// Mock Interviewers
export const interviewers: Interviewer[] = [
  {
    id: '1',
    name: 'Alice Williams',
    email: 'alice.w@example.com',
    department: 'Design',
    position: 'Design Director',
    availability: [
      {
        day: 'Monday',
        timeSlots: ['10:00 AM', '2:00 PM', '4:00 PM']
      },
      {
        day: 'Wednesday',
        timeSlots: ['11:00 AM', '3:00 PM']
      }
    ]
  },
  {
    id: '2',
    name: 'David Lee',
    email: 'david.l@example.com',
    department: 'Engineering',
    position: 'Senior Developer',
    availability: [
      {
        day: 'Tuesday',
        timeSlots: ['9:00 AM', '1:00 PM', '5:00 PM']
      },
      {
        day: 'Thursday',
        timeSlots: ['10:00 AM', '2:00 PM']
      }
    ]
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    department: 'Product',
    position: 'VP of Product',
    availability: [
      {
        day: 'Wednesday',
        timeSlots: ['9:00 AM', '11:00 AM']
      },
      {
        day: 'Friday',
        timeSlots: ['1:00 PM', '3:00 PM']
      }
    ]
  }
];

// Mock Offer Letters
export const offerLetters: OfferLetter[] = [
  {
    id: '1',
    candidateId: '4',
    position: 'Product Manager',
    salary: '$120,000',
    startDate: '2025-04-15',
    status: 'sent',
    sentDate: '2025-03-18'
  }
];

// Mock Email Templates
export const emailTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Standard Offer Letter',
    subject: 'Your Offer from TechCorp',
    body: `Dear {{candidateName}},

We are pleased to offer you the position of {{position}} at TechCorp, with a starting salary of {{salary}}. Your anticipated start date will be {{startDate}}.

This offer is contingent upon the successful completion of background checks and reference verification.

Please review the attached offer letter for complete details regarding your compensation, benefits, and terms of employment.

To accept this offer, please sign the attached letter and return it to us by {{responseDeadline}}.

We are excited about the possibility of you joining our team and look forward to your positive response.

Best regards,
HR Team
TechCorp`,
    type: 'offer'
  },
  {
    id: '2',
    name: 'Interview Invitation',
    subject: 'Interview Invitation - {{position}} Position',
    body: `Dear {{candidateName}},

Thank you for your application for the {{position}} position at TechCorp.

We would like to invite you for an interview on {{interviewDate}} at {{interviewTime}}. The interview will be conducted {{interviewType}} and will last approximately {{duration}} minutes.

{{additionalInstructions}}

Please confirm your attendance by replying to this email. If the suggested time doesn't work for you, please provide some alternative times that would be suitable.

We look forward to meeting you and discussing your application further.

Best regards,
Recruitment Team
TechCorp`,
    type: 'interview'
  }
];

// Mock Metrics Data
export const metricsData: MetricsData = {
  openPositions: 8,
  activeCandidates: 24,
  interviewsScheduled: 12,
  offersExtended: 3,
  timeToHire: 28 // in days
};