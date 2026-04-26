import { NextRequest, NextResponse } from 'next/server';
import { GrokClient } from '@/lib/grok-client';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('screenshot') as File;
    const resumeId = formData.get('resume_id') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Missing screenshot file' },
        { status: 400 }
      );
    }

    // 读取文件
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/png';

    // 用 Grok 分析职位截图
    const jobData = await GrokClient.analyzeJobScreenshot(base64, mimeType);

    return NextResponse.json({
      success: true,
      jobData,
      screenshotUrl: `data:${mimeType};base64,${base64}`,
    });
  } catch (error) {
    console.error('Screenshot analysis failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze screenshot',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
