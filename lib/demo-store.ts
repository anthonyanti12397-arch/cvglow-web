import { Resume, UserProfile, DemoUser } from './types'

const DEMO_USER: DemoUser = {
  id: 'demo-user-001',
  email: 'demo@cvglow.app',
  full_name: 'Demo User',
}

const DEMO_PROFILE: UserProfile = {
  id: 'demo-user-001',
  full_name: 'Demo User',
  subscription_status: 'free',
  created_at: new Date().toISOString(),
}

const DEMO_RESUMES: Resume[] = [
  {
    id: 'resume-001',
    user_id: 'demo-user-001',
    title: 'Software Engineer Resume',
    content: {
      fullName: 'Alex Chen',
      jobTitle: 'Senior Software Engineer',
      email: 'alex.chen@email.com',
      phone: '+1 (555) 123-4567',
      summary: 'Experienced software engineer with 5+ years building scalable web applications. Passionate about clean code and user experience.',
      experiences: [
        {
          company: 'TechCorp Inc.',
          position: 'Senior Software Engineer',
          startDate: '2021-01',
          endDate: 'Present',
          description: 'Led development of microservices architecture serving 2M+ users. Reduced API response time by 40%.',
        },
        {
          company: 'StartupXYZ',
          position: 'Software Engineer',
          startDate: '2019-06',
          endDate: '2020-12',
          description: 'Built React frontend and Node.js backend for SaaS platform. Shipped 3 major features per quarter.',
        },
      ],
      educations: [
        {
          school: 'University of California, Berkeley',
          degree: 'Bachelor',
          field: 'Computer Science',
          graduateYear: '2019',
        },
      ],
      skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// In-memory store for demo
let resumes = [...DEMO_RESUMES]
let profile = { ...DEMO_PROFILE }
let isLoggedIn = false

export const demoStore = {
  getUser: () => (isLoggedIn ? DEMO_USER : null),
  getProfile: () => profile,
  login: (email: string) => {
    isLoggedIn = true
    return { ...DEMO_USER, email }
  },
  signup: (email: string, name: string) => {
    isLoggedIn = true
    profile = { ...DEMO_PROFILE, full_name: name }
    return { ...DEMO_USER, email, full_name: name }
  },
  logout: () => { isLoggedIn = false },
  isLoggedIn: () => isLoggedIn,
  getResumes: () => resumes,
  getResume: (id: string) => resumes.find(r => r.id === id) || null,
  createResume: (data: Partial<Resume>) => {
    const newResume: Resume = {
      id: `resume-${Date.now()}`,
      user_id: DEMO_USER.id,
      title: data.title || 'Untitled Resume',
      content: data.content!,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    resumes = [newResume, ...resumes]
    return newResume
  },
  updateResume: (id: string, data: Partial<Resume>) => {
    resumes = resumes.map(r => r.id === id ? { ...r, ...data, updated_at: new Date().toISOString() } : r)
    return resumes.find(r => r.id === id) || null
  },
  deleteResume: (id: string) => {
    resumes = resumes.filter(r => r.id !== id)
  },
  upgradeToPremium: () => {
    profile = { ...profile, subscription_status: 'premium' }
  },
}
