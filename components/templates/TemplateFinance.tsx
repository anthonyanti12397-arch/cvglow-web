import { ResumeContent } from '@/lib/types'

// Finance — conservative, structured, traditional banking/finance aesthetic
export default function TemplateFinance({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-white text-gray-900 p-8 min-h-[1000px]" style={{fontFamily: "Garamond, 'Times New Roman', serif"}}>
      {/* Centered header — classic finance */}
      <div className="text-center border-b-2 border-gray-900 pb-5 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-wide uppercase">{content.fullName || 'Your Name'}</h1>
        {content.jobTitle && <p className="text-sm font-medium tracking-widest uppercase text-gray-600 mb-3">{content.jobTitle}</p>}
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500 justify-center">
          {content.email && <span>{content.email}</span>}
          {content.phone && <span>{content.phone}</span>}
        </div>
      </div>

      {content.summary && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3 text-gray-700">Profile</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{content.summary}</p>
        </div>
      )}

      {content.experiences?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3 text-gray-700">Professional Experience</h2>
          <div className="space-y-5">
            {content.experiences.map((exp, i) => (
              <div key={i}>
                <div className="flex items-start justify-between mb-0.5">
                  <div className="font-bold text-gray-900">{exp.company}</div>
                  <div className="text-sm text-gray-500 shrink-0 ml-4">
                    {exp.startDate && `${exp.startDate} – ${exp.endDate || 'Present'}`}
                  </div>
                </div>
                <div className="text-sm font-medium italic text-gray-600 mb-1">{exp.position}</div>
                {exp.description && <p className="text-sm text-gray-700 leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {content.educations?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3 text-gray-700">Education</h2>
          <div className="space-y-3">
            {content.educations.map((edu, i) => (
              <div key={i} className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-gray-900">{edu.school}</div>
                  <div className="text-sm italic text-gray-600">{edu.degree} in {edu.field}</div>
                </div>
                <div className="text-sm text-gray-500 shrink-0 ml-4">{edu.graduateYear}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {content.skills?.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3 text-gray-700">Competencies</h2>
          <div className="columns-2 gap-4">
            {content.skills.map((skill, i) => (
              <div key={i} className="text-sm text-gray-700 mb-1">• {skill}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
