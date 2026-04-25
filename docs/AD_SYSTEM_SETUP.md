# CVGlow 广告系统设置指南

## 概述

CVGlow为Free用户实现了广告支持模式：**每导出2份PDF，用户需要观看一次Google AdSense广告（5秒）后才能继续。**

## 工作原理

```
Free用户导出流程：
1. 用户点击"Download PDF"按钮
2. 系统检查PDF导出计数 (存储在sessionStorage)
3. 如果计数达到2的倍数（2, 4, 6...）：
   ✅ 显示广告模态框（Google AdSense）
   ✅ 用户必须等待5秒
   ✅ 5秒后显示"继续导出"按钮
   ✅ 用户点击后完成PDF下载
4. Premium用户：直接下载，无广告
```

## 需要的环境变量

### 开发环境 (.env.local)
```bash
# Google AdSense配置
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
```

### Vercel部署
在Vercel项目Settings → Environment Variables中添加：
```
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
```

## 获取Google AdSense凭证

### 第1步：创建Google AdSense账户
1. 访问 [Google AdSense](https://www.google.com/adsense/start)
2. 使用Google账户登录（或创建新账户）
3. 点击"立即开始"
4. 输入网站URL：`https://cvglow-web.vercel.app`
5. 选择广告类型
6. 接受条款并提交申请

### 第2步：等待批准（通常1-2天）
Google会验证你的网站并批准AdSense申请。

### 第3步：获取发布商ID
批准后：
1. 登录 [AdSense控制台](https://adsense.google.com)
2. 左侧菜单 → "账户"
3. 复制 **发布商ID**（格式：`ca-pub-xxxxxxxxxxxxxxxx`）

### 第4步：获取广告代码
1. 左侧菜单 → "广告"
2. 点击"创建新的广告单元"
3. 选择"展示广告"
4. 输入名称（例如：`modal-ad`）
5. 复制生成的广告代码中的 `data-ad-slot` 值

## 配置AdModal.tsx

编辑 `components/AdModal.tsx`，替换：

```typescript
// 旧代码：
data-ad-client="ca-pub-xxxxxxxxxxxxxxxx" // 替换为实际的 AdSense ID
data-ad-slot="xxxxxxxx" // 替换为实际的 ad slot

// 新代码（从AdSense获取）：
data-ad-client="ca-pub-1234567890abcdef"
data-ad-slot="9876543210"
```

## 部署步骤

### 本地测试（开发模式）
```bash
# 1. 更新.env.local
echo "NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxx" >> .env.local

# 2. 重启dev服务器
npm run dev

# 3. 导出2份PDF，应该会看到广告模态框
```

### 部署到Vercel
```bash
# 1. 推送代码到GitHub
git add .
git commit -m "feat: add Google AdSense free user ad system"
git push origin main

# 2. 在Vercel中配置环境变量
#    Settings → Environment Variables
#    Name: NEXT_PUBLIC_ADSENSE_CLIENT_ID
#    Value: ca-pub-xxx

# 3. Vercel自动部署
```

## 广告跟踪

### 用户端追踪
- **位置**：`sessionStorage` → `pdf_export_count`
- **刷新页面后重置**（预期行为）
- **计数逻辑**：每点击"Download PDF"加1

### AdSense数据
- **控制台**：[AdSense Statistics](https://adsense.google.com/u/0/home/my-ads)
- **关键指标**：
  - Impressions（展示次数）
  - Clicks（点击次数）
  - CTR（点击率）
  - Earnings（收益）

## 用户体验流程

### Free用户（未升级）
```
第1次导出 → 直接下载（无广告）
第2次导出 → 看5秒广告 → 下载
第3次导出 → 直接下载
第4次导出 → 看5秒广告 → 下载
...
```

### Premium用户（已升级）
```
任何导出 → 直接下载（无广告）✅
```

## 监控和优化

### 收益优化
1. **广告单元尺寸**：推荐300x250（中等矩形）
2. **投放频率**：当前每2次导出1次（可调整）
3. **显示时长**：当前5秒（`minShowDuration`参数）

### 调整参数
编辑 `app/resume/[id]/preview/page.tsx`：
```typescript
// 改变广告显示间隔（当前：2次导出）
if (isFreePlan && newCount % 2 === 0) { ... }

// 改变显示时长（单位：秒）
<AdModal minShowDuration={7} /> // 改为7秒
```

### A/B测试建议
- 测试间隔：2次 vs 3次 vs 4次导出
- 测试时长：5秒 vs 7秒 vs 10秒
- 测试内容：展示广告 vs 自有宣传

## 合规性

### Google AdSense政策
- ✅ 广告显示需要用户知情同意
- ✅ 禁止点击欺诈（正当间隔显示）
- ✅ 保护用户隐私（GDPR等）

### CVGlow政策建议
- 在条款中说明Free计划包含广告
- 明确显示广告的具体时机
- 提供清晰的Premium升级选项

## 故障排除

### 广告不显示
```
原因1：NEXT_PUBLIC_ADSENSE_CLIENT_ID未配置
解决：检查.env.local或Vercel环境变量

原因2：AdSense账户未批准
解决：等待Google审核（通常1-2天）

原因3：发布商ID或slot ID错误
解决：复制检查AdSense控制台的正确ID
```

### 用户无法下载
```
原因：广告模态框冻结（应该不会发生）
解决：刷新页面，重新导出（计数会重置）
```

### 收益为0
```
原因1：广告展示次数不足
解决：等待积累数据，通常需要100+展示

原因2：地理位置（CPC低地区）
解决：正常现象，无解决方案

原因3：广告质量分低
解决：检查网站内容质量，遵守AdSense政策
```

## 下一步

1. **即刻**：获取Google AdSense账户
2. **明天**：部署到Vercel并配置环境变量
3. **本周**：在手机上测试广告流程
4. **本月**：监控收益并优化广告参数

---

**预期日均收益估算**
- 假设：100个Free用户 × 2次导出/天 = 200展示
- CPM（中文）：$2-5 /1000展示
- **预期日收益**：$0.40-1.00

随着用户增长，广告收益会线性增长。结合Premium升级收费，可形成双重变现模式。
