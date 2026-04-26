import { NextRequest, NextResponse } from 'next/server';
import { GrokClient } from '@/lib/grok-client';

export async function POST(req: NextRequest) {
  try {
    const { resume_content, job_title, job_requirements, required_skills } =
      await req.json();

    if (!resume_content || !job_title || !job_requirements) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 用 Grok 生成定制简历
    const customizationData = await GrokClient.generateCustomResume(
      resume_content,
      job_title,
      job_requirements,
      required_skills || []
    );

    return NextResponse.json({
      success: true,
      customization: customizationData,
    });
  } catch (error) {
    console.error('Resume customization failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to customize resume',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
