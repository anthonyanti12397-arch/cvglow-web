import { ResumeContent } from '@/lib/types'

// Creative — two-column layout, bold accent, for design/marketing/media roles
export default function TemplateCreative({ content }: { content: ResumeContent }) {
  const accent = "#FF6B5B"

  return (
    <div className="bg-white text-gray-900 min-h-[1000px] flex" style={{fontFamily: "'Inter', -apple-system, sans-serif"}}>
      {/* Left sidebar */}
      <div className="w-64 shrink-0 p-6 flex flex-col gap-6" style={{background: "#0A1628", color: "white"}}>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight mb-1">{content.fullName || 'Your Name'}</h1>
          {content.jobTitle && <p className="text-xs font-medium" style={{color: accent}}>{content.jobTitle}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{color: "#64748b"}}>Contact</div>
          {content.email && <div className="text-xs text-blue-200 break-all">{content.email}</div>}
          {content.phone && <div className="text-xs text-blue-200">{content.phone}</div>}
        </div>

        {content.skills?.length > 0 && (
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{color: "#64748b"}}>Skills</div>
            <div className="space-y-1.5">
              {content.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{background: accent}}></div>
                  <span className="text-xs text-blue-100">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {content.educations?.length > 0 && (
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{color: "#64748b"}}>Education</div>
            <div className="space-y-3">
              {content.educations.map((edu, i) => (
                <div key={i}>
                  <div className="text-xs font-medium text-white">{edu.school}</div>
                  <div className="text-xs text-blue-300">{edu.degree}</div>
                  <div className="text-xs text-blue-400">{edu.field} · {edu.graduateYear}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right main content */}
      <div className="flex-1 p-8">
        {content.summary && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-0.5" style={{background: accent}}></div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">About</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{content.summary}</p>
          </div>
        )}

        {content.experiences?.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-0.5" style={{background: accent}}></div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Experience</h2>
            </div>
            <div className="space-y-6">
              {content.experiences.map((exp, i) => (
                <div key={i}>
                  <div className="flex items-start justify-between mb-0.5">
                    <div>
                      <div className="font-bold text-gray-900">{exp.position}</div>
                      <div className="text-sm font-medium" style={{color: accent}}>{exp.company}</div>
                    </div>
                    <div className="text-xs text-gray-400 shrink-0 ml-4 mt-0.5">
                      {exp.startDate && `${exp.startDate} – ${exp.endDate || 'Now'}`}
                    </div>
                  </div>
                  {exp.description && <p className="text-sm text-gray-600 leading-relaxed mt-1">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
