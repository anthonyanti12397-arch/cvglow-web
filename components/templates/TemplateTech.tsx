import { ResumeContent } from '@/lib/types'

// Tech — dark header, monospace accents, clean for engineers
export default function TemplateTech({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-white text-gray-900 min-h-[1000px]" style={{fontFamily: "'Inter', -apple-system, sans-serif"}}>
      {/* Dark header */}
      <div className="px-8 py-7" style={{background: "#0A1628"}}>
        <h1 className="text-3xl font-bold text-white mb-1">{content.fullName || 'Your Name'}</h1>
        {content.jobTitle && (
          <p className="text-base font-medium mb-3" style={{color: "#FF6B5B"}}>{content.jobTitle}</p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm" style={{color: "#94a3b8"}}>
          {content.email && <span>{content.email}</span>}
          {content.phone && <span>{content.phone}</span>}
        </div>
      </div>

      <div className="p-8">
        {/* Skills first for tech */}
        {content.skills?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{color: "#FF6B5B"}}>Technical Skills</h2>
            <div className="flex flex-wrap gap-2">
              {content.skills.map((skill, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded font-mono border" style={{borderColor: "#e2e8f0", color: "#334155", background: "#f8fafc"}}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {content.summary && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{color: "#FF6B5B"}}>About</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{content.summary}</p>
          </div>
        )}

        {content.experiences?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{color: "#FF6B5B"}}>Experience</h2>
            <div className="space-y-5">
              {content.experiences.map((exp, i) => (
                <div key={i} className="border-l-2 pl-4" style={{borderColor: "#e2e8f0"}}>
                  <div className="flex items-start justify-between mb-0.5">
                    <div className="font-bold text-gray-900 text-sm">{exp.position}</div>
                    <div className="text-xs text-gray-400 shrink-0 ml-4 font-mono">
                      {exp.startDate && `${exp.startDate} – ${exp.endDate || 'Present'}`}
                    </div>
                  </div>
                  <div className="text-sm font-medium mb-1.5" style={{color: "#0A1628"}}>{exp.company}</div>
                  {exp.description && <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {content.educations?.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{color: "#FF6B5B"}}>Education</h2>
            <div className="space-y-3">
              {content.educations.map((edu, i) => (
                <div key={i} className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{edu.school}</div>
                    <div className="text-sm text-gray-500">{edu.degree} in {edu.field}</div>
                  </div>
                  <div className="text-xs text-gray-400 shrink-0 ml-4 font-mono">{edu.graduateYear}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
