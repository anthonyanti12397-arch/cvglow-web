import { ResumeContent } from '@/lib/types'

interface Props {
  content: ResumeContent
  id?: string
}

export default function ResumePreview({ content, id }: Props) {
  return (
    <div id={id} className="bg-white text-gray-900 p-8 min-h-[1000px] font-sans" style={{fontFamily: "Georgia, serif"}}>
      {/* Header */}
      <div className="border-b-2 pb-5 mb-5" style={{borderColor: "#8239f5"}}>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{content.fullName || 'Your Name'}</h1>
        {content.jobTitle && (
          <p className="text-lg font-medium mb-2" style={{color: "#8239f5"}}>{content.jobTitle}</p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
          {content.email && <span>{content.email}</span>}
          {content.phone && <span>{content.phone}</span>}
        </div>
      </div>

      {/* Summary */}
      {content.summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Professional Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{content.summary}</p>
        </div>
      )}

      {/* Experience */}
      {content.experiences?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Work Experience</h2>
          <div className="space-y-4">
            {content.experiences.map((exp, i) => (
              <div key={i}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-gray-900">{exp.position || 'Position'}</div>
                    <div className="text-sm font-medium" style={{color: "#8239f5"}}>{exp.company || 'Company'}</div>
                  </div>
                  <div className="text-sm text-gray-400 text-right shrink-0 ml-4">
                    {exp.startDate && `${exp.startDate} – ${exp.endDate || 'Present'}`}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {content.educations?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Education</h2>
          <div className="space-y-3">
            {content.educations.map((edu, i) => (
              <div key={i} className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-gray-900">{edu.school || 'School'}</div>
                  <div className="text-sm text-gray-600">{edu.degree} in {edu.field}</div>
                </div>
                <div className="text-sm text-gray-400 shrink-0 ml-4">
                  {edu.graduateYear && `Class of ${edu.graduateYear}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {content.skills?.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {content.skills.map((skill, i) => (
              <span key={i} className="text-sm px-3 py-1 rounded-full border" style={{borderColor: "#dcd5ff", color: "#6d1ee8", background: "#f8f7ff"}}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
