const GROK_API_KEY = process.env.GROK_API_KEY || '';
const GROK_BASE_URL = 'https://api.x.ai/v1';

export interface ATSResult {
  score: number // 0-100
  verdict: 'Strong' | 'Good' | 'Needs Work' | 'Weak'
  matched_keywords: string[]
  missing_keywords: string[]
  strengths: string[]
  improvements: string[]
  summary: string
}

export interface CoverLetterResult {
  cover_letter: string
  word_count: number
}

export interface JobData {
  job_title: string;
  company_name?: string;
  job_requirements: string;
  required_skills: string[];
  key_responsibilities?: string[];
  salary_range?: string;
}

export interface CustomizationResult {
  customized_summary: string;
  customized_experiences: Array<{
    company: string;
    position: string;
    description: string;
  }>;
  highlighted_skills: string[];
  optimization_tips: string;
}

export class GrokClient {
  /**
   * 分析职位截图，提取职位信息
   */
  static async analyzeJobScreenshot(
    base64: string,
    mimeType: string
  ): Promise<JobData> {
    try {
      const response = await fetch(`${GROK_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'grok-2-vision-1212',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${mimeType};base64,${base64}`,
                    detail: 'high',
                  },
                },
                {
                  type: 'text',
                  text: `从这个职位截图提取以下 JSON 信息：
{
  "job_title": "职位名称（必需）",
  "company_name": "公司名称",
  "job_requirements": "职位要求和职责（详细内容，必需）",
  "required_skills": ["技能1", "技能2", "技能3"],
  "key_responsibilities": ["职责1", "职责2"],
  "salary_range": "薪资范围（如有）"
}

规则：
- 必须返回有效的 JSON
- required_skills 和 key_responsibilities 必须是数组
- 只返回 JSON，不要任何其他文字`,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Grok API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No response from Grok');
      }

      // 解析 JSON，移除可能的 markdown 包装
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      const parsed = JSON.parse(jsonStr);

      // 确保数组字段是数组
      return {
        job_title: parsed.job_title || '未知职位',
        company_name: parsed.company_name,
        job_requirements: parsed.job_requirements || '',
        required_skills: Array.isArray(parsed.required_skills)
          ? parsed.required_skills
          : [],
        key_responsibilities: Array.isArray(parsed.key_responsibilities)
          ? parsed.key_responsibilities
          : [],
        salary_range: parsed.salary_range,
      };
    } catch (error) {
      console.error('Screenshot analysis failed:', error);
      throw new Error(
        `Failed to analyze screenshot: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * 生成定制简历
   */
  static async generateCustomResume(
    resumeContent: any,
    jobTitle: string,
    jobRequirements: string,
    requiredSkills: string[]
  ): Promise<CustomizationResult> {
    try {
      const response = await fetch(`${GROK_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'grok-4.20-reasoning',
          messages: [
            {
              role: 'user',
              content: `你是职业简历顾问。根据以下信息生成定制简历：

【原始简历内容】
${JSON.stringify(resumeContent, null, 2)}

【目标职位】
职位名称: ${jobTitle}
职位要求: ${jobRequirements}
所需技能: ${requiredSkills.join(', ')}

任务：
1. 重写职业摘要（Summary），突出与该职位相关的经验和成就
2. 重新组织工作经验，强调与职位要求相关的部分
3. 识别现有技能中与职位匹配的，并优先突出
4. 提供优化建议

请返回有效的 JSON 格式，不要任何其他内容：
{
  "customized_summary": "新的职业摘要（2-3句话，聚焦于目标职位的相关经验）",
  "customized_experiences": [
    {
      "company": "公司名称",
      "position": "职位名称",
      "description": "重新组织的职责描述，强调与目标职位相关的部分"
    }
  ],
  "highlighted_skills": ["最相关的技能1", "最相关的技能2", "最相关的技能3"],
  "optimization_tips": "具体的优化建议（例如建议补充哪些经验、强化哪些技能等）"
}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Grok API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No response from Grok');
      }

      // 解析 JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      const parsed = JSON.parse(jsonStr);

      return {
        customized_summary: parsed.customized_summary || '',
        customized_experiences: Array.isArray(parsed.customized_experiences)
          ? parsed.customized_experiences
          : [],
        highlighted_skills: Array.isArray(parsed.highlighted_skills)
          ? parsed.highlighted_skills
          : [],
        optimization_tips: parsed.optimization_tips || '',
      };
    } catch (error) {
      console.error('Resume customization failed:', error);
      throw new Error(
        `Failed to customize resume: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Score a resume against a job description (ATS simulation)
   */
  static async scoreATS(
    resumeContent: any,
    jobTitle: string,
    jobDescription: string
  ): Promise<ATSResult> {
    try {
      const response = await fetch(`${GROK_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'grok-4.20-reasoning',
          messages: [
            {
              role: 'user',
              content: `You are an expert ATS (Applicant Tracking System) analyst. Evaluate how well this resume matches the job posting.

RESUME:
${JSON.stringify(resumeContent, null, 2)}

JOB TITLE: ${jobTitle}
JOB DESCRIPTION:
${jobDescription}

Analyse the resume against the job description. Be rigorous and honest.

Return ONLY valid JSON:
{
  "score": <integer 0-100>,
  "verdict": <"Strong"|"Good"|"Needs Work"|"Weak">,
  "matched_keywords": [<keywords from the job description that appear in the resume>],
  "missing_keywords": [<important keywords from the job description that are absent>],
  "strengths": [<2-3 specific things the resume does well for this role>],
  "improvements": [<2-3 specific, actionable improvements>],
  "summary": "<one sentence verdict>"
}`,
            },
          ],
        }),
      });

      if (!response.ok) throw new Error(`Grok API error: ${response.statusText}`);

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '{}';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);

      return {
        score: Math.min(100, Math.max(0, parsed.score ?? 0)),
        verdict: parsed.verdict ?? 'Needs Work',
        matched_keywords: Array.isArray(parsed.matched_keywords) ? parsed.matched_keywords : [],
        missing_keywords: Array.isArray(parsed.missing_keywords) ? parsed.missing_keywords : [],
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
        summary: parsed.summary ?? '',
      };
    } catch (error) {
      console.error('ATS scoring failed:', error);
      throw new Error(`Failed to score resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse a LinkedIn PDF export into structured resume data
   */
  static async parseLinkedInPDF(
    base64: string,
    mimeType: string
  ): Promise<{
    fullName: string
    jobTitle: string
    email: string
    phone: string
    summary: string
    experiences: Array<{ company: string; position: string; startDate: string; endDate: string; description: string }>
    educations: Array<{ school: string; degree: string; field: string; graduateYear: string }>
    skills: string[]
  }> {
    const response = await fetch(`${GROK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROK_API_KEY}` },
      body: JSON.stringify({
        model: 'grok-2-vision-1212',
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${base64}`, detail: 'high' },
            },
            {
              type: 'text',
              text: `This is a LinkedIn profile PDF export. Extract ALL information and return ONLY this JSON (no markdown, no explanation):
{
  "fullName": "full name",
  "jobTitle": "current job title or headline",
  "email": "email if visible, else empty string",
  "phone": "phone if visible, else empty string",
  "summary": "About/Summary section text",
  "experiences": [
    { "company": "company name", "position": "job title", "startDate": "YYYY-MM", "endDate": "YYYY-MM or Present", "description": "responsibilities and achievements" }
  ],
  "educations": [
    { "school": "school name", "degree": "Bachelor/Master/PhD/etc", "field": "field of study", "graduateYear": "YYYY" }
  ],
  "skills": ["skill1", "skill2", "skill3"]
}
Rules: experiences and educations must be arrays. skills must be an array of strings. Return valid JSON only.`,
            },
          ],
        }],
      }),
    })

    if (!response.ok) throw new Error(`Grok API error: ${response.statusText}`)
    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || '{}'
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text)

    return {
      fullName: parsed.fullName || '',
      jobTitle: parsed.jobTitle || '',
      email: parsed.email || '',
      phone: parsed.phone || '',
      summary: parsed.summary || '',
      experiences: Array.isArray(parsed.experiences) ? parsed.experiences : [],
      educations: Array.isArray(parsed.educations) ? parsed.educations : [],
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    }
  }

  /**
   * Run an interview simulation turn
   */
  static async interviewTurn(
    resumeContent: any,
    jobTitle: string,
    history: Array<{ role: 'interviewer' | 'candidate'; content: string }>,
    candidateAnswer: string
  ): Promise<{ question: string; feedback: string; score: number }> {
    const historyText = history.map(h => `${h.role === 'interviewer' ? 'Interviewer' : 'You'}: ${h.content}`).join('\n')

    const response = await fetch(`${GROK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROK_API_KEY}` },
      body: JSON.stringify({
        model: 'grok-4.20-reasoning',
        messages: [{
          role: 'user',
          content: `You are an experienced interviewer at a top company conducting a job interview.

CANDIDATE RESUME:
${JSON.stringify(resumeContent, null, 2)}

TARGET ROLE: ${jobTitle}

INTERVIEW SO FAR:
${historyText || '(Interview is starting)'}
${candidateAnswer ? `Candidate's latest answer: ${candidateAnswer}` : ''}

Your task:
1. If this is the first question, introduce yourself briefly and ask a strong opening question.
2. Otherwise, give brief feedback on the candidate's last answer (be honest, constructive, specific), then ask the next interview question.
3. Ask questions covering: background, technical skills, behavioral (STAR method), problem-solving.
4. After 6+ exchanges, you may signal the interview is wrapping up.

Return ONLY valid JSON:
{
  "question": "your next interview question or closing statement",
  "feedback": "brief honest feedback on their last answer (empty string if first question)",
  "score": <integer 1-10 rating of their last answer quality, 5 if first question>
}`,
        }],
      }),
    })

    if (!response.ok) throw new Error(`Grok API error: ${response.statusText}`)
    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || '{}'
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text)

    return {
      question: parsed.question || '',
      feedback: parsed.feedback || '',
      score: Math.min(10, Math.max(1, parsed.score ?? 5)),
    }
  }

  /**
   * Generate a personalised cover letter
   */
  static async generateCoverLetter(
    resumeContent: any,
    jobTitle: string,
    companyName: string,
    jobDescription: string
  ): Promise<CoverLetterResult> {
    try {
      const response = await fetch(`${GROK_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'grok-4.20-reasoning',
          messages: [
            {
              role: 'user',
              content: `You are a professional career coach writing a compelling cover letter. Write in first person as the candidate. Sound human, not AI-generated.

CANDIDATE RESUME:
${JSON.stringify(resumeContent, null, 2)}

TARGET ROLE: ${jobTitle} at ${companyName || 'the company'}
JOB DESCRIPTION:
${jobDescription}

Write a 3-paragraph cover letter (250-320 words) that:
1. Opens with a specific, compelling hook — not "I am writing to apply for..."
2. Connects 2-3 of the candidate's most relevant experiences directly to the job requirements
3. Closes with confidence and a clear call to action

Return ONLY valid JSON:
{
  "cover_letter": "<full cover letter text with \\n for line breaks>",
  "word_count": <integer>
}`,
            },
          ],
        }),
      });

      if (!response.ok) throw new Error(`Grok API error: ${response.statusText}`);

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '{}';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);

      return {
        cover_letter: parsed.cover_letter ?? '',
        word_count: parsed.word_count ?? 0,
      };
    } catch (error) {
      console.error('Cover letter generation failed:', error);
      throw new Error(`Failed to generate cover letter: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * AI Career Coach — stateless single-turn chat
   * Uses grok-3-fast to keep costs low
   */
  static async coachChat(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<string> {
    const response = await fetch(`${GROK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROK_API_KEY}` },
      body: JSON.stringify({
        model: 'grok-4-0709',
        messages: [
          {
            role: 'system',
            content: `You are an expert career coach specialising in the Hong Kong job market. You help job seekers with:
- Resume writing and ATS optimisation for HK employers
- Cover letter strategy and writing
- Interview preparation (STAR method, common HK employer questions, culture fit)
- Salary negotiation — always give specific HK$ ranges by industry and seniority
- Industry-specific hiring: Finance (banks, HF, PE), Tech, Legal, Healthcare, Hospitality
- Job search strategy on JobsDB, LinkedIn HK, Indeed, recruiters vs direct applications
- Work visa and MPF considerations for expats

Be direct, specific, and actionable. Cite HK market context where relevant.
Keep answers concise (150-250 words). Use bullet points for lists.
If asked something outside career coaching, briefly answer then redirect.`,
          },
          ...messages,
        ],
        max_tokens: 500,
      }),
    })

    if (!response.ok) throw new Error(`Grok API error: ${response.statusText}`)
    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response. Please try again.'
  }
}
