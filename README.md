# 游记系统前端

这是一个为旅行爱好者设计的在线平台，用户可以分享、发现并探讨他们的旅行经历。此系统前端提供丰富的交互界面和功能，使用户能够轻松发布和浏览旅游相关内容。

## 技术栈

- **React**: 构建用户界面的 JavaScript 库。
- **Next.js**: 提供服务端渲染支持的 React 框架。
- **TypeScript**: 增强 JavaScript 的语言，提供类型系统和现代 JavaScript 特性。
- **Ant Design Mobile**: 提供一套响应式的 UI 组件库，专为移动端设计。

## 功能描述

- **用户认证**: 登录与注册，用户可以通过 `login.tsx` 和 `PersonLogin.tsx` 管理自己的身份认证。
- **帖子管理**: 用户可以创建、编辑和删除游记帖子。相关组件包括 `AddPost.tsx`, `EditPost.tsx`, `MyPost.tsx`。
- **图片上传**: 用户可以上传旅行图片，参见 `AddImage.tsx` 和 `AvatarUpload.tsx`。
- **搜索功能**: 通过 `searchPage.tsx` 提供城市和旅行话题的搜索功能。
- **旅行详情**: 查看具体的旅行地点和详细信息，对应文件 `travelDetail.tsx` 和 `bannerTravel.tsx`。
- **动态瀑布流展示**: 使用 `TravelWaterFlow.tsx` 和 `WaterFlow.tsx` 实现旅行帖子的瀑布流布局。
- **底部导航**: `BottomBar.tsx` 为应用提供了底部导航栏，方便用户切换不同的视图。

## 项目结构

/ # 根目录
│
├── components/ # 存放所有 React 组件
│ ├── AddPost.tsx
│ ├── EditPost.tsx
│ └── ...
│
├── styles/ # 样式文件
│ ├── globals.scss
│ └── ...
│
├── public/ # 静态文件
│ └── images/
│
├── pages/ # 页面文件
│ └── index.tsx
│
└── lib/ # 助手函数和库
└── debounce.ts

## 配置文件

- **.eslintrc.json**: ESLint 配置，确保代码风格一致性。
- **.prettierrc.js**: Prettier 配置，自动格式化代码风格。
- **next.config.js**: Next.js 配置文件，包括图片优化、Sass 支持等设置。

## 安装与运行

1. 安装依赖：

   ```
   npm install
   ```

2. 运行开发服务器：

   ```
   npm run dev
   ```

   访问 `http://localhost:3000` 查看应用。

## 贡献指南

对于希望贡献代码或改进项目的开发者，请遵循以下简易步骤：

1. 克隆仓库
2. 创建新的分支
3. 提交更改
4. 发起拉取请求

我们欢迎所有形式的贡献，感谢您的支持！

## 许可证

此项目采用 [MIT 许可证](LICENSE)。
