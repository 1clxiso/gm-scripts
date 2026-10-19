# 浏览器回归检查

在仓库根目录运行：

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

在浏览器访问 `http://127.0.0.1:8765/tests/browser.html`，等待出现 `ALL 40 CHECKS PASSED`。

测试覆盖：提前启动、动态更新、语言切换、登录 iframe、Apple Pay 按钮语言、付款表单数据、下拉选项提交值、组合配送文案、客服号码与联系人姓名保护。测试使用本地虚构数据，不访问 Apple 结账服务，不执行付款。
