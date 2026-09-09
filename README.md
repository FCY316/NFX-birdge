# NFX Bridge 前端项目

NFX Bridge 是一个基于 React + TypeScript + TailwindCSS 的跨链桥接应用。

## 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Ant Design** - UI 组件库
- **TailwindCSS** - 样式框架
- **Ethers.js** - 区块链交互
- **React Router** - 路由管理
- **Zustand** - 状态管理
- **i18next** - 国际化

## 环境要求

- Node.js >= 16.x
- npm 或 yarn

## 安装依赖

```bash
npm install
# 或
yarn install
```

## 开发环境

项目支持三种环境配置，分别对应不同的环境变量文件：

- **开发环境**: `config/.env.development`
- **测试环境**: `config/.env.test`
- **生产环境**: `config/.env.production`

### 启动开发服务器

```bash
# 开发环境
npm run start:dev

# 测试环境
npm run start:test

# 生产环境预览
npm run start:pro
```

启动后访问 `http://localhost:3000`（端口可能不同，以终端输出为准）

## 编译打包

### 打包命令

根据目标环境选择对应的打包命令：

```bash
# 打包开发环境
npm run build:dev

# 打包测试环境
npm run build:test

# 打包生产环境（线上部署）
npm run build:pro
```

### 打包产物

打包完成后，静态文件会生成在 `build/` 目录下，包含：

- `index.html` - 入口 HTML 文件
- `static/` - 静态资源（JS、CSS、图片等）

## 部署到线上环境

### 方式一：静态服务器部署（推荐）

1. **打包生产环境代码**
   ```bash
   npm run build:pro
   ```

2. **上传到服务器**
   
   将 `build/` 目录下的所有文件上传到服务器的 Web 根目录（如 Nginx 的 `/usr/share/nginx/html`）

3. **配置 Nginx**

   创建或修改 Nginx 配置文件：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /usr/share/nginx/html;
       index index.html;

       # 支持 React Router 的 History 模式
       location / {
           try_files $uri $uri/ /index.html;
       }

       # 静态资源缓存
       location /static/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # Gzip 压缩
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
   }
   ```

4. **重启 Nginx**
   ```bash
   sudo nginx -t  # 测试配置
   sudo systemctl reload nginx
   ```

### 方式二：CDN 部署

1. 打包生产环境代码
2. 将 `build/` 目录上传到 CDN（如阿里云 OSS、腾讯云 COS、AWS S3）
3. 配置 CDN 的默认首页为 `index.html`
4. 配置 404 页面重定向到 `index.html`（支持前端路由）

### 方式三：Docker 部署

1. **创建 Dockerfile**
   ```dockerfile
   # 构建阶段
   FROM node:16-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build:pro

   # 运行阶段
   FROM nginx:alpine
   COPY --from=builder /app/build /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **构建镜像**
   ```bash
   docker build -t nfx-bridge:latest .
   ```

3. **运行容器**
   ```bash
   docker run -d -p 80:80 nfx-bridge:latest
   ```

## 环境变量配置

在部署前，请确保 `config/.env.production` 文件中的环境变量配置正确：

- API 接口地址
- 合约地址
- 链 ID
- RPC 节点地址
- 其他配置项

## 项目结构

```
NFX-bridge/
├── public/              # 静态资源
├── src/
│   ├── components/      # 公共组件
│   ├── hooks/          # 自定义 Hooks
│   ├── Layout/         # 布局组件
│   ├── page/           # 页面组件
│   ├── router/         # 路由配置
│   ├── store/          # 状态管理
│   ├── style/          # 全局样式
│   └── utils/          # 工具函数
├── config/             # 环境配置
├── craco.config.js     # CRACO 配置
└── package.json        # 项目配置
```

## 常见问题

### 1. 打包后页面空白
- 检查 `package.json` 中的 `homepage` 字段
- 确认服务器配置支持前端路由

### 2. 静态资源 404
- 检查资源路径配置
- 确认服务器静态资源目录配置正确

### 3. 钱包连接失败
- 检查环境变量中的链 ID 和 RPC 配置
- 确认用户钱包已安装且网络正确

## 性能优化建议

1. **启用 Gzip/Brotli 压缩**
2. **配置 CDN 加速静态资源**
3. **启用浏览器缓存**
4. **使用 HTTPS**
5. **配置合理的 CSP 策略**

## License

Private
