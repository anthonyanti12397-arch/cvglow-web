export interface Experience {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

export interface Education {
  school: string
  degree: string
  field: string
  graduateYear: string
}

export interface ResumeContent {
  fullName: string
  jobTitle: string
  email: string
  phone?: string
  summary?: string
  experiences: Experience[]
  educations: Education[]
  skills: string[]
}

export interface Resume {
  id: string
  user_id: string
  title: string
  content: ResumeContent
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  full_name: string
  subscription_status: 'free' | 'premium'
  subscription_id?: string
  created_at: string
}

export interface DemoUser {
  id: string
  email: string
  full_name: string
}
