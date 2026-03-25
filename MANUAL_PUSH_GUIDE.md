# 手动推送代码指南

## 🚨 当前情况

- ✅ 代码已 100% 完成
- ✅ 代码已提交到本地 Git 仓库（3个提交待推送）
- ❌ 推送到远程仓库失败（权限问题：403 Forbidden）

## 🔑 问题原因

错误信息：
```
remote: Permission to 1515772513/game-companion-uni.git denied to yangsiwei-boop.
fatal: 无法访问 'https://github.com/1515772513/game-companion-uni.git/'：The requested URL returned error: 403
```

**原因**: Git 配置中的用户凭据（yangsiwei-boop）没有推送权限到该仓库。

## ✅ 解决方案

### 方案一：使用正确的 GitHub Token（推荐）

#### 步骤 1: 获取有权限的 GitHub Token
1. 登录到有权限的 GitHub 账号
2. 进入 Settings → Developer settings → Personal access tokens → Tokens (classic)
3. 生成新的 Token，选择 `repo` 权限
4. 复制生成的 Token（格式：`ghp_xxxxxxxxxxxx`）

#### 步骤 2: 更新远程仓库 URL

```bash
# 进入项目目录
cd /home/kemove/ai_dev_projects/PRJ-20260325135440/game-companion-uni/branchs/sit

# 更新远程 URL（替换 <username> 和 <token>）
git remote set-url origin https://<username>:<token>@github.com/1515772513/game-companion-uni.git

# 例如：
# git remote set-url origin https://1515772513:<YOUR_TOKEN>@github.com/1515772513/game-companion-uni.git
```

#### 步骤 3: 推送代码

```bash
# 推送到远程仓库
git push origin sit
```

---

### 方案二：使用 SSH 密钥

#### 步骤 1: 生成 SSH 密钥（如果没有）

```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 查看公钥
cat ~/.ssh/id_ed25519.pub
```

#### 步骤 2: 添加 SSH 密钥到 GitHub

1. 复制公钥内容
2. 进入 GitHub → Settings → SSH and GPG keys
3. 点击 "New SSH key"，粘贴公钥

#### 步骤 3: 更改远程 URL 为 SSH

```bash
# 切换到 SSH URL
git remote set-url origin git@github.com:1515772513/game-companion-uni.git

# 测试连接
ssh -T git@github.com

# 推送代码
git push origin sit
```

---

### 方案三：使用 Git Credential Helper（交互式）

#### 步骤 1: 清除旧凭据

```bash
# 清除凭据缓存
git config --local --unset credential.helper
git config --global --unset credential.helper
```

#### 步骤 2: 配置凭据助手

```bash
# 设置凭据助手
git config --global credential.helper store
```

#### 步骤 3: 推送并输入凭据

```bash
# 推送时会提示输入用户名和密码
# 用户名：GitHub 用户名
# 密码：GitHub Token（不是登录密码）
git push origin sit
```

---

### 方案四：联系仓库管理员

如果您没有仓库的推送权限，需要联系仓库管理员：

#### 给管理员的信息模板：

```
主题：申请 game-companion-uni 仓库推送权限

尊敬的管理员：

我是项目开发者，需要在 game-companion-uni 仓库的 sit 分支进行开发。

请求为以下账号添加推送权限：
- GitHub 用户名：[你的用户名]
- 邮箱：[你的邮箱]
- 分支：sit

谢谢！

此致
[你的名字]
```

---

## 📋 验证推送是否成功

推送成功后，你应该看到类似这样的输出：

```
Enumerating objects: 45, done.
Counting objects: 100% (45/45), done.
Delta compression using up to 4 threads
Compressing objects: 100% (40/40), done.
Writing objects: 100% (44/44), 48.66 KiB | 2.43 MiB/s, done.
Total 44 (delta 3), reused 0 (delta 0), pack-reused 0
To github.com:1515772513/game-companion-uni.git
 * [new branch]      sit -> sit
```

验证命令：
```bash
# 查看状态
git status

# 应该显示：
# Your branch is up to date with 'origin/sit'.
```

---

## 🔧 其他有用的命令

### 查看当前远程配置
```bash
git remote -v
```

### 查看待推送的提交
```bash
git log origin/sit..sit --oneline
```

### 查看远程分支状态
```bash
git branch -vv
```

### 强制推送（谨慎使用）
```bash
# 如果远程有冲突，可以强制推送
git push origin sit --force
```

### 只推送当前分支
```bash
git push origin HEAD:sit
```

---

## 📝 快速推送命令（复制即用）

### 如果你有 GitHub Token：

```bash
cd /home/kemove/ai_dev_projects/PRJ-20260325135440/game-companion-uni/branchs/sit

# 替换 <username> 和 <token>
git remote set-url origin https://<username>:<token>@github.com/1515772513/game-companion-uni.git

git push origin sit
```

### 如果使用 SSH：

```bash
cd /home/kemove/ai_dev_projects/PRJ-20260325135440/game-companion-uni/branchs/sit

git remote set-url origin git@github.com:1515772513/game-companion-uni.git

git push origin sit
```

---

## 🆘 常见问题

### Q1: 提示 "Permission denied"
**A**: 检查 GitHub Token 是否有 `repo` 权限，或是否有仓库的写入权限。

### Q2: 提示 "SSL certificate problem"
**A**: 可以临时禁用 SSL 验证（不推荐）：
```bash
git config --global http.sslVerify false
```

### Q3: 提示 "Connection timed out"
**A**: 可能是网络问题，尝试：
- 切换网络
- 使用代理
- 稍后重试

### Q4: 提示 "failed to push some refs"
**A**: 远程分支有更新，需要先拉取：
```bash
git pull origin sit --rebase
git push origin sit
```

---

## 📞 获取帮助

如果以上方案都无法解决问题，请：

1. 检查 GitHub 仓库设置 → Settings → Collaborators
2. 确认您的账号在协作者列表中
3. 联系仓库管理员

---

## ✅ 推送成功后

推送成功后，您可以：

1. 在 GitHub 上查看代码
2. 创建 Pull Request 合并到主分支
3. 继续在本地开发新功能
4. 使用 `git push` 推送后续的更新

---

**祝推送顺利！** 🎉

---

*文档创建时间: 2026-03-25*
*项目路径: /home/kemove/ai_dev_projects/PRJ-20260325135440/game-companion-uni/branchs/sit*
