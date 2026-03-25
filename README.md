# game-companion-uni
游戏陪玩-客户端
微信小程序端（uni-app + Vue3）README.md
这是陪玩平台微信小程序，基于 uni-app + Vue3 + Vite 开发，支持用户端、陪玩师端双角色，对接 .NET 8 WebAPI 后端接口。
项目介绍
面向 C 端用户与陪玩师的微信小程序
支持微信快捷登录、在线下单、实时接单、消息通知、订单管理、钱包提现等功能
采用 uni-app 跨端框架，一套代码运行在微信小程序
界面简洁、交互流畅、性能优化
技术栈
框架：uni-app (Vue3 + setup 语法糖)
编译器：Vite
UI 组件：uni-ui / uView Plus
网络请求：uni.request 封装
登录体系：微信官方登录（code → openid）
实时通知：WebSocket
后端接口：.NET 8 WebAPI
数据库：MySQL
项目目录结构
plaintext
├── src/
│   ├── api/           # 接口请求封装
│   ├── pages/         # 页面（用户/陪玩师/订单/我的）
│   ├── components/    # 公共组件
│   ├── static/        # 图片、图标资源
│   ├── store/         # 状态管理（pinia）
│   ├── utils/         # 工具类（时间、加密、校验）
│   ├── App.vue
│   └── main.js
├── manifest.json      # 小程序配置
├── pages.json         # 路由配置
└── vite.config.js     # Vite 配置
环境要求
HBuilderX 最新版
Node.js >= 16
微信开发者工具
微信小程序 AppID

# 发布
HBuilderX 点击：发行 → 微信小程序自动上传代码，在微信公众平台提交审核
微信小程序必备能力
微信登录（code2Session）
微信支付（V3）
图片上传
实时消息推送
地理位置权限（可选）
客服消息
部署说明（后端）
后端 API 部署在阿里云 ECS
接口必须支持跨域
安全组放行端口（5000/8080 等）
账号说明
用户：微信自动登录
陪玩师：需后台审核通过后才能接单
管理员：PC 管理后台审核
常见问题
无法连接后端
检查 ECS 安全组端口
检查接口地址是否正确
检查后端服务是否启动
微信登录失败
检查 AppID 是否正确
检查服务器域名是否在小程序白名单
支付失败
检查微信支付商户号配置
检查订单金额与商户权限