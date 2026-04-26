import { ResumeContent } from '@/lib/types'

// Minimal — ultra-clean, lots of white space, for senior/executive roles
export default function TemplateMinimal({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-white text-gray-900 p-10 min-h-[1000px]" style={{fontFamily: "'Inter', -apple-system, sans-serif"}}>
      <div className="mb-10">
        <h1 className="text-4xl font-light text-gray-900 mb-2 tracking-tight">{content.fullName || 'Your Name'}</h1>
        {content.jobTitle && <p className="text-base text-gray-500 mb-3">{content.jobTitle}</p>}
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-400">
          {content.email && <span>{content.email}</span>}
          {content.phone && <span>{content.phone}</span>}
        </div>
      </div>

      {content.summary && (
        <div className="mb-8">
          <p className="text-base text-gray-600 leading-relaxed max-w-2xl">{content.summary}</p>
        </div>
      )}

      {content.experiences?.length > 0 && (
        <div className="mb-8">
          <div className="text-xs text-gray-300 uppercase tracking-[0.2em] mb-5">Experience</div>
          <div className="space-y-6">
            {content.experiences.map((exp, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto] gap-8 items-start">
                <div>
                  <div className="font-semibold text-gray-900 mb-0.5">{exp.position}</div>
                  <div className="text-sm text-gray-500 mb-1.5">{exp.company}</div>
                  {exp.description && <p className="text-sm text-gray-500 leading-relaxed">{exp.description}</p>}
                </div>
                <div className="text-xs text-gray-300 shrink-0 text-right whitespace-nowrap pt-0.5">
                  {exp.startDate && `${exp.startDate} – ${exp.endDate || 'Present'}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {content.educations?.length > 0 && (
        <div className="mb-8">
          <div className="text-xs text-gray-300 uppercase tracking-[0.2em] mb-5">Education</div>
          <div className="space-y-3">
            {content.educations.map((edu, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto] gap-8">
                <div>
                  <div className="font-semibold text-gray-900">{edu.school}</div>
                  <div className="text-sm text-gray-500">{edu.degree} · {edu.field}</div>
                </div>
                <div className="text-xs text-gray-300 shrink-0 text-right">{edu.graduateYear}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {content.skills?.length > 0 && (
        <div>
          <div className="text-xs text-gray-300 uppercase tracking-[0.2em] mb-4">Skills</div>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {content.skills.map((skill, i) => (
              <span key={i} className="text-sm text-gray-500">{skill}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
