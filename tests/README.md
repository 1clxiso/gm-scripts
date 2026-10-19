# 浏览器回归检查

在仓库根目录运行：

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

在浏览器访问 `http://127.0.0.1:8765/tests/browser.html`，等待出现 `ALL 132 CHECKS PASSED`。

测试覆盖：提前启动、动态更新、语言切换、登录 iframe、Apple Pay 按钮语言、付款表单数据、下拉选项提交值、组合配送文案、客服号码与联系人姓名保护。测试使用本地虚构数据，不访问 Apple 结账服务，不执行付款。

付款及订单候选案例保存在 `payment-order-cases.json`。示例邮箱使用保留域名 `example.com`，编号与卡尾号均为测试占位值。

可先运行无依赖的词典／模板检查：

```sh
node tests/translation.test.cjs
```

这会检查所有词条、78 条付款、订单与错误模板、重复翻译稳定性、大小写一致性、首尾空白保留与动态数据保护。

网页错误弹窗案例位于 `error-dialog-cases.json`。测试只读取原生函数引用，确认脚本未改写 `alert` / `confirm` / `prompt`、表单提交或校验 API；不会调用原生弹窗，也不安装原生弹窗替身。

通过本地 `<dialog>`、`role="alert"`、关闭按钮、必填输入和 `aria-errormessage` 引用，验证动态翻译、英文恢复和原有交互行为。
