# API Box 项目说明文档

## 🧡说明
该项目代码主要使用DeepSeek生成，调试了下细节部分。

## 功能特点

### 🔍 接口测试
- 支持 GET、POST、PUT、DELETE、PATCH 等多种 HTTP 方法
- 可自定义请求头和请求体
- 实时显示响应状态码、耗时和数据大小
- 一键复制响应结果

### 🎭 Mock 数据生成
- 快速创建和管理 Mock 接口
- 支持 JSON 格式的响应模板配置
- 集成 Faker.js，提供丰富的数据生成器
- 支持单对象和数组数据类型
- 实时预览 Mock 数据效果

### 📋 历史记录
- 自动保存请求历史
- 支持按 URL 和方法搜索历史记录
- 清晰展示请求方法、URL、状态码、耗时和时间

## 技术栈
- 前端框架: React 18
- 全栈框架: Next.js 15
- 语言: TypeScript
- 样式框架: Tailwind CSS
- 状态管理: Zustand
- 模拟数据: @faker-js/faker
- HTTP 请求: Axios
- 代码格式化: Prettier
- ESLint: 代码质量检查

## 安装与运行

### 前提条件
确保您的系统已安装以下软件：

- Node.js (推荐 v16 或更高版本)
- npm、yarn 或 pnpm (本项目使用 pnpm)

### 安装依赖

```bash
# 使用 pnpm
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 运行开发服务器

```bash
# 使用 pnpm
pnpm dev

# 或使用 npm
npm run dev

# 或使用 yarn
yarn dev
```
开发服务器启动后，访问 http://localhost:3000 即可使用应用。

### 构建生产版本

```bash
# 使用 pnpm
pnpm build

# 或使用 npm
npm run build

# 或使用 yarn
yarn build
```

### 启动生产服务器

```bash
# 使用 pnpm
pnpm start

# 或使用 npm
npm run start

# 或使用 yarn
yarn start
```

## 使用指南

### 接口测试
1. 在左侧面板选择请求方法 (GET、POST 等)
2. 输入请求 URL
3. 可选择性地添加请求头和请求体
4. 点击 "发送请求" 按钮
5. 在右侧面板查看响应结果

### Mock 数据生成
1. 切换到 "Mock数据" 标签页
2. 填写接口名称、路径、方法等基本信息
3. 选择数据类型 (对象或数组)，如果是数组还可以设置生成数量
4. 在响应结构中配置 JSON 模板，可使用 Faker.js 的语法生成动态数据
5. 点击 "示例数据" 可快速生成常用模板
6. 点击 "预览结果" 可查看模拟数据效果
7. 点击 "创建Mock接口" 保存接口
8. 创建成功后，可在下方列表查看和管理已创建的接口

### 使用 Mock 接口
1. 切换到 "接口测试" 标签页
2. 点击 "使用Mock" 按钮
3. 选择已创建的 Mock 接口
4. 系统会自动填充请求方法和 URL
5. 直接点击 "发送请求" 即可测试 Mock 接口

## Mock 数据模板语法
API Tester Pro 使用 Faker.js 生成模拟数据，支持以下常用语法：

- `{{string.uuid()}}` - 生成 UUID
- `{{person.fullName()}}` - 生成完整姓名
- `{{person.sex()}}` - 生成性别
- `{{person.jobTitle()}}` - 生成职位
- `{{datatype.number({ min: 18, max: 60 })}}` - 生成年龄
- `{{internet.email()}}` - 生成邮箱地址
- `{{phone.number()}}` - 生成电话号码
- `{{location.city()}}` - 生成城市名称
- `{{location.streetAddress()}}` - 生成街道地址
- `{{location.country()}}` - 生成国家
- `{{location.zipCode()}}` - 生成邮编
- `{{date.recent()}}` - 生成最近的日期
- `{{date.birthdate()}}` - 生成日期
- `{{company.name()}}` - 生成公司名称
- `{{lorem.sentence()}}` - 生成随机句子
- `{{lorem.paragraph()}}` - 生成随机段落
- `{{image.avatar()}}` - 生成随机头像
- `{{color.rgb()}}` - 生成随机 RGB 颜色

更多语法请参考 Faker.js 文档。

## 项目结构

```plaintext
api-box/
├── app/                # Next.js App Router 应用目录
│   ├── api/            # API 路由
│   ├── components/     # React 组件
│   ├── data/           # 数据文件
│   ├── lib/            # 工具函数和库
│   ├── store/          # Zustand 状态管理
│   ├── styles/         # 样式文件
│   ├── layout.tsx      # 布局组件
│   └── page.tsx        # 主页面
├── public/             # 静态资源
├── next.config.js      # Next.js 配置
├── package.json        # 项目依赖和脚本
├── postcss.config.js   # PostCSS 配置
├── tailwind.config.js  # Tailwind CSS 配置
└── tsconfig.json       # TypeScript 配置
```

## 注意事项
- Mock 数据仅在当前浏览器环境下存储，清除浏览器缓存可能导致数据丢失
- 请求历史记录也使用浏览器本地存储，同样可能受到缓存清理的影响
- 对于跨域请求，可能需要配置 CORS 相关的请求头
