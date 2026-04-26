'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import ResumePreview from '@/components/ResumePreview';
import { Resume } from '@/lib/types';

interface JobData {
  job_title: string;
  company_name?: string;
  job_requirements: string;
  required_skills: string[];
  key_responsibilities?: string[];
  salary_range?: string;
}

interface CustomizationData {
  customized_summary: string;
  customized_experiences: Array<{
    company: string;
    position: string;
    description: string;
  }>;
  highlighted_skills: string[];
  optimization_tips: string;
}

interface CustomizationRecord {
  id: string;
  job_title: string;
  company_name?: string;
  created_at: string;
  jobData: JobData;
  customization: CustomizationData;
  screenshot: string;
}

export default function CustomizeResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [resume, setResume] = useState<Resume | null>(null);
  const [step, setStep] = useState<'upload' | 'extract' | 'customize' | 'result'>(
    'upload'
  );
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [customization, setCustomization] = useState<CustomizationData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customizations, setCustomizations] = useState<CustomizationRecord[]>(
    []
  );

  // 加载简历
  useEffect(() => {
    const stored = sessionStorage.getItem('cvglow_user');
    if (!stored && id !== 'demo') {
      window.location.href = '/auth/login';
      return;
    }

    const resumes = JSON.parse(
      sessionStorage.getItem('cvglow_resumes') || '[]'
    );
    const found = resumes.find((r: Resume) => r.id === id);
    if (found) {
      setResume(found);
    }

    // 加载定制历史
    const savedCustomizations = localStorage.getItem(
      `customizations_${id}`
    );
    if (savedCustomizations) {
      setCustomizations(JSON.parse(savedCustomizations));
    }
  }, [id]);

  // 处理截图上传
  async function handleScreenshotUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setLoading(true);
    setScreenshot(file);

    // 创建预览
    const reader = new FileReader();
    reader.onload = (event) => {
      setScreenshotPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // 上传到 API 进行分析
      const formData = new FormData();
      formData.append('screenshot', file);
      formData.append('resume_id', id);

      const res = await fetch('/api/jobs/analyze-screenshot', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to analyze screenshot');
      }

      const data = await res.json();
      setJobData(data.jobData);
      setStep('extract');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to analyze screenshot'
      );
    } finally {
      setLoading(false);
    }
  }

  // 生成定制简历
  async function generateCustomization() {
    if (!jobData || !resume) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/resumes/customize-for-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_content: resume.content,
          job_title: jobData.job_title,
          job_requirements: jobData.job_requirements,
          required_skills: jobData.required_skills,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to customize resume');
      }

      const data = await res.json();
      setCustomization(data.customization);

      // 保存到 localStorage
      const newRecord: CustomizationRecord = {
        id: Date.now().toString(),
        job_title: jobData.job_title,
        company_name: jobData.company_name,
        created_at: new Date().toISOString(),
        jobData,
        customization: data.customization,
        screenshot: screenshotPreview,
      };

      const updated = [newRecord, ...customizations];
      setCustomizations(updated);
      localStorage.setItem(`customizations_${id}`, JSON.stringify(updated));

      setStep('result');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to customize resume'
      );
    } finally {
      setLoading(false);
    }
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-purple-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* 头部 */}
        <div className="mb-8">
          <Link
            href={`/resume/${id}/preview`}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            ← 返回简历预览
          </Link>
          <h1 className="text-4xl font-bold mt-4">为职位定制简历</h1>
          <p className="text-gray-600 mt-2">
            上传职位截图，AI 将自动为您生成定制版本的简历
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* 左侧：上传和编辑 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 步骤 1: 上传截图 */}
            <div
              className={`p-6 rounded-lg border-2 ${
                step === 'upload' || step === 'extract' || step === 'customize' || step === 'result'
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200'
              }`}
            >
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-center text-sm">
                  1
                </span>
                上传职位截图
              </h2>

              <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center cursor-pointer hover:bg-purple-50 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  className="hidden"
                  id="screenshot-input"
                />
                <label htmlFor="screenshot-input" className="cursor-pointer block">
                  <div className="text-3xl mb-2">📸</div>
                  <p className="text-sm font-medium text-gray-700">
                    点击上传职位截图
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    支持 JPG, PNG 格式
                  </p>
                </label>
              </div>

              {loading && step === 'upload' && (
                <p className="mt-4 text-center text-sm text-gray-600">
                  分析中... ⏳
                </p>
              )}
            </div>

            {/* 步骤 2: 职位信息 */}
            {jobData && (
              <div className="p-6 rounded-lg border-2 border-blue-200 bg-blue-50">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-center text-sm">
                    2
                  </span>
                  职位信息
                </h2>

                <div className="space-y-3 text-sm">
                  <div>
                    <strong>职位:</strong> {jobData.job_title}
                  </div>
                  {jobData.company_name && (
                    <div>
                      <strong>公司:</strong> {jobData.company_name}
                    </div>
                  )}
                  {jobData.salary_range && (
                    <div>
                      <strong>薪资:</strong> {jobData.salary_range}
                    </div>
                  )}
                  {jobData.required_skills.length > 0 && (
                    <div>
                      <strong>所需技能:</strong>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {jobData.required_skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={generateCustomization}
                  disabled={loading}
                  className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-60 font-medium transition"
                >
                  {loading ? '生成中... 🤖' : '生成定制简历 ✨'}
                </button>
              </div>
            )}

            {/* 步骤 3: 定制结果 */}
            {customization && (
              <div className="p-6 rounded-lg border-2 border-green-200 bg-green-50">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-green-600 text-white text-center text-sm">
                    3
                  </span>
                  定制完成 ✅
                </h2>

                <div className="space-y-3 text-sm">
                  <div>
                    <strong>⭐ 推荐突出的技能:</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {customization.highlighted_skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition">
                  ✅ 应用到简历
                </button>
              </div>
            )}
          </div>

          {/* 右侧：截图预览和结果 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 截图预览 */}
            {screenshotPreview && (
              <div className="p-6 rounded-lg border border-gray-200 bg-white">
                <h3 className="font-bold mb-4">📷 职位截图</h3>
                <img
                  src={screenshotPreview}
                  alt="Job screenshot"
                  className="w-full rounded-lg border border-gray-200 max-h-96 object-cover"
                />
              </div>
            )}

            {/* 定制结果详情 */}
            {customization && (
              <div className="space-y-6">
                {/* 优化后的职业摘要 */}
                <div className="p-6 rounded-lg border border-gray-200 bg-white">
                  <h3 className="font-bold mb-3">📝 优化后的职业摘要</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {customization.customized_summary}
                  </p>
                </div>

                {/* 优化建议 */}
                <div className="p-6 rounded-lg border border-gray-200 bg-white">
                  <h3 className="font-bold mb-3">💡 优化建议</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {customization.optimization_tips}
                  </p>
                </div>

                {/* 重新组织的工作经验 */}
                {customization.customized_experiences.length > 0 && (
                  <div className="p-6 rounded-lg border border-gray-200 bg-white">
                    <h3 className="font-bold mb-4">💼 重新组织的工作经验</h3>
                    <div className="space-y-4">
                      {customization.customized_experiences.map((exp, i) => (
                        <div key={i} className="border-l-4 border-purple-600 pl-4">
                          <div className="font-bold text-gray-900">
                            {exp.position}
                          </div>
                          <div className="text-sm text-gray-600">
                            {exp.company}
                          </div>
                          <p className="text-sm text-gray-700 mt-2">
                            {exp.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 定制历史 */}
            {customizations.length > 0 && (
              <div className="p-6 rounded-lg border border-gray-200 bg-white">
                <h3 className="font-bold mb-4">📋 定制历史</h3>
                <div className="space-y-2">
                  {customizations.map((record) => (
                    <div
                      key={record.id}
                      className="p-3 rounded bg-gray-50 text-sm cursor-pointer hover:bg-gray-100 transition"
                    >
                      <div className="font-medium text-gray-900">
                        {record.job_title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {record.company_name} •{' '}
                        {new Date(record.created_at).toLocaleDateString('zh-HK')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
