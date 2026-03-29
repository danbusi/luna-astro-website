# 🚀 Luna Astro 官网部署指南

## ✅ 已创建文件

```
website/
├── index.html      # 首页（产品说明 + 价格）
├── terms.html      # Terms of Service（Paddle 必需）
├── privacy.html    # Privacy Policy（Paddle 必需）
├── refund.html     # Refund Policy（Paddle 必需）
└── DEPLOY.md       # 本文件
```

---

## 🌐 部署方案（3 选 1）

### 方案 A：Vercel 部署（推荐 ⭐）- 5 分钟上线

**优点：** 免费、自动 HTTPS、全球 CDN、支持自定义域名

**步骤：**

1. **上传代码到 GitHub**
   ```bash
   cd /root/.openclaw/workspace/products/luna-astro/website
   git init
   git add .
   git commit -m "Initial Luna Astro website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/luna-astro-website.git
   git push -u origin main
   ```

2. **部署到 Vercel**
   - 访问 https://vercel.com
   - 用 GitHub 登录
   - 点击 "New Project"
   - 选择 `luna-astro-website` 仓库
   - 点击 "Deploy"

3. **配置自定义域名**
   - Vercel 项目 Settings → Domains
   - 添加 `lunaastro.cn` 和 `www.lunaastro.cn`
   - 按提示配置 DNS（在你的域名注册商处）

**DNS 配置示例（以阿里云为例）：**
```
类型    主机记录    记录值
CNAME   www       cname.vercel-dns.com
ALIAS   @         76.76.21.21
```

---

### 方案 B：Netlify 部署 - 5 分钟上线

**优点：** 免费、拖拽部署、自动 HTTPS

**步骤：**

1. 访问 https://app.netlify.com/drop
2. 将 `website/` 文件夹拖拽到页面
3. 网站立即上线（会获得一个随机域名）
4. 在 Site Settings → Domain Management 添加自定义域名 `lunaastro.cn`

---

### 方案 C：GitHub Pages - 完全免费

**优点：** 免费、与 GitHub 集成

**步骤：**

1. 创建 GitHub 仓库 `luna-astro-website`
2. 上传所有 HTML 文件
3. Settings → Pages → Source 选择 `main` 分支
4. 网站地址：`https://YOUR_USERNAME.github.io/luna-astro-website/`
5. 自定义域名：在 Custom domain 输入 `lunaastro.cn`

---

## 📝 Paddle 申请填写指南

### 申诉材料（Submit additional information）

```
Subject: Merchant Application - Luna Astro (AI Astrology Service)

Dear Paddle Team,

I am applying for a Paddle merchant account to sell my AI-powered astrology 
subscription service.

【Business Information】
- Company Name: [你的公司名或个人姓名]
- Website: https://lunaastro.cn
- Business Type: Digital Service / SaaS
- Location: [你的城市/国家]

【Product Description】
Luna is an AI astrology app that provides personalized love horoscopes 
and relationship compatibility analysis for users aged 18-34.

【Business Model】
- Free Trial: 2 free readings
- Subscription: $9.99/month or $89/year
- Pay-per-use: $1 for 5 readings

【Website Status】
Our website is now live at https://lunaastro.cn with:
- Product description and features
- Transparent pricing
- Terms of Service
- Privacy Policy  
- Refund Policy (14-day money-back guarantee)

【Compliance】
- We comply with Paddle's Acceptable Use Policy
- No prohibited content or services
- Clear refund and cancellation policies
- GDPR-compliant privacy practices

We are a legitimate startup and look forward to partnering with Paddle.
Happy to provide any additional documentation if needed.

Best regards,
[你的名字]
Founder, Luna Astro
Email: hello@lunaastro.cn
```

---

## ⚠️ 重要检查清单

部署后确认：

- [ ] 网站可通过 `https://lunaastro.cn` 访问
- [ ] HTTPS 证书正常（浏览器显示小锁）
- [ ] 首页包含产品说明和价格
- [ ] Terms of Service 页面可访问
- [ ] Privacy Policy 页面可访问
- [ ] Refund Policy 页面可访问
- [ ] 联系方式（邮箱）可见
- [ ] 移动端显示正常

---

## 🎯 下一步

1. **立即部署网站**（选一个方案，5 分钟搞定）
2. **提交 Paddle 申诉**（用上面的模板）
3. **等待审核**（通常 1-3 个工作日）
4. **集成 Paddle 支付**（审核通过后）

---

**有问题随时找我！** 🚀
