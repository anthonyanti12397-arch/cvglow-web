import { ResumeContent } from '@/lib/types'
import { TemplateId } from '@/lib/templates'
import TemplateClassic from './templates/TemplateClassic'
import TemplateTech from './templates/TemplateTech'
import TemplateFinance from './templates/TemplateFinance'
import TemplateCreative from './templates/TemplateCreative'
import TemplateMinimal from './templates/TemplateMinimal'

interface Props {
  content: ResumeContent
  id?: string
  template?: TemplateId
}

export default function ResumePreview({ content, id, template = 'classic' }: Props) {
  const templates: Record<TemplateId, React.ReactNode> = {
    classic: <TemplateClassic content={content} />,
    tech: <TemplateTech content={content} />,
    finance: <TemplateFinance content={content} />,
    creative: <TemplateCreative content={content} />,
    minimal: <TemplateMinimal content={content} />,
  }

  return (
    <div id={id}>
      {templates[template] ?? templates['classic']}
    </div>
  )
}
