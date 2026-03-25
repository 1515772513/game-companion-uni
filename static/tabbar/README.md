# TabBar 图标说明

## 当前状态

TabBar 图标文件已创建，但仅为占位文件。

## 需要的图标

pages.json 中配置了以下 TabBar 图标：

### 主包 TabBar
1. **home.png** - 首页图标（未选中状态）
2. **home-active.png** - 首页图标（选中状态）
3. **order.png** - 订单图标（未选中状态）
4. **order-active.png** - 订单图标（选中状态）
5. **message.png** - 消息图标（未选中状态）
6. **message-active.png** - 消息图标（选中状态）
7. **profile.png** - 我的图标（未选中状态）
8. **profile.png** - 我的图标（选中状态）

## 图标规格

- **尺寸**: 建议尺寸 81px × 81px（最大不超过 120kb）
- **格式**: PNG
- **颜色**:
  - 未选中：灰色（如 #999999）
  - 选中：主题色（如 #FF6B00）

## 如何添加图标

### 方法 1：使用设计工具创建

1. 使用 Figma、Sketch、Photoshop 等工具创建图标
2. 导出为 PNG 格式，81px × 81px
3. 替换当前目录下的占位文件

### 方法 2：使用在线图标库

推荐资源：
- [Iconfont](https://www.iconfont.cn/)
- [IconPark](https://iconpark.oceanengine.com/)
- [Flaticon](https://www.flaticon.com/)

搜索关键词：
- home, 首页
- order, 订单, document
- message, 消息, chat
- profile, 个人, user

### 方法 3：使用 IconPark 推荐

根据项目主题色（#FF6B00），推荐以下图标风格：

1. **首页**: home-outline / 填充版本
2. **订单**: document-list / file-list
3. **消息**: chat / message
4. **我的**: user / profile

## 临时解决方案

在正式图标准备好之前，项目使用空占位文件。小程序仍然可以正常运行，只是 TabBar 图标不会显示。

## 快速生成脚本

如果需要快速生成测试图标，可以使用以下工具：

### 使用 ImageMagick 生成简单图标

```bash
# 安装 ImageMagick 后
cd static/tabbar

# 生成简单的圆形图标
convert -size 81x81 xc:#999999 home.png
convert -size 81x81 xc:#FF6B00 home-active.png
convert -size 81x81 xc:#999999 order.png
convert -size 81x81 xc:#FF6B00 order-active.png
convert -size 81x81 xc:#999999 message.png
convert -size 81x81 xc:#FF6B00 message-active.png
convert -size 81x81 xc:#999999 profile.png
convert -size 81x81 xc:#FF6B00 profile-active.png
```

### 使用 Canvas 生成（在浏览器中）

创建一个 HTML 文件，使用 Canvas 生成图标并下载：

```html
<!DOCTYPE html>
<html>
<head>
  <title>生成 TabBar 图标</title>
</head>
<body>
  <canvas id="canvas" width="81" height="81"></canvas>
  <button onclick="generateIcons()">生成并下载</button>
  <script>
    function generateIcons() {
      const icons = ['home', 'order', 'message', 'profile'];
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      icons.forEach(icon => {
        // 未选中状态 - 灰色
        ctx.fillStyle = '#999999';
        ctx.fillRect(0, 0, 81, 81);
        downloadCanvas(canvas, `${icon}.png`);

        // 选中状态 - 橙色
        ctx.fillStyle = '#FF6B00';
        ctx.fillRect(0, 0, 81, 81);
        downloadCanvas(canvas, `${icon}-active.png`);
      });
    }

    function downloadCanvas(canvas, filename) {
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  </script>
</body>
</html>
```

## 检查清单

在提交小程序审核前，请确保：

- [ ] 所有 8 个图标文件都已添加
- [ ] 图标尺寸符合要求（81px × 81px）
- [ ] 图标文件大小不超过 120kb
- [ ] 选中状态的图标使用了主题色
- [ ] 图标在小程序中显示正常

## 注意事项

1. **不要使用临时图标提交审核** - 微信可能会审核不通过
2. **保持图标风格统一** - 使用相同的设计风格
3. **测试显示效果** - 在真机上测试 TabBar 显示
4. **考虑暗黑模式** - 如果支持暗黑模式，准备两套图标

---

*文档创建时间: 2026-03-25*
*项目: game-companion-uni*
