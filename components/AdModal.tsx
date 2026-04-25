'use client'

import { useEffect, useState } from 'react'

interface AdModalProps {
  isOpen: boolean
  onClose: () => void
  minShowDuration?: number // 最少显示时长（秒）
}

export default function AdModal({ isOpen, onClose, minShowDuration = 5 }: AdModalProps) {
  const [canClose, setCanClose] = useState(false)
  const [remainingTime, setRemainingTime] = useState(minShowDuration)

  useEffect(() => {
    if (!isOpen) return

    // 重置计时器
    setCanClose(false)
    setRemainingTime(minShowDuration)

    // 倒计时
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          setCanClose(true)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, minShowDuration])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* 广告区域 */}
        <div className="bg-gradient-to-b from-purple-50 to-blue-50 p-6 min-h-[280px] flex items-center justify-center">
          {/* Google AdSense 将在这里显示 */}
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-xxxxxxxxxxxxxxxx" // 替换为实际的 AdSense ID
            data-ad-slot="xxxxxxxx" // 替换为实际的 ad slot
            data-ad-format="vertical"
            data-full-width-responsive="true"
          ></ins>

          {/* 如果AdSense未加载，显示备用内容 */}
          <div className="text-center hidden">
            <div className="text-5xl mb-4">✨</div>
            <p className="text-gray-600 text-sm">
              升级到Premium移除所有广告，享受无限简历编辑
            </p>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="bg-white px-6 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-4">
            Free版本由广告支持。
            {!canClose && (
              <span className="font-semibold text-purple-600 ml-1">
                {remainingTime}秒后可关闭
              </span>
            )}
          </p>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={!canClose}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                canClose
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {canClose ? '继续导出' : `请等待${remainingTime}秒`}
            </button>
            <button
              onClick={() => window.open('/pricing', '_blank')}
              className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm border border-purple-600 text-purple-600 hover:bg-purple-50 transition-all"
            >
              升级 Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
