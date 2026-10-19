// 验证实际用户脚本中的词典与模板；无需安装依赖，不启动页面或访问网络。
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../apple-giftcard-zh.user.js'), 'utf8');
const start = source.indexOf('  const DICT =');
const end = source.indexOf('  const ATTRS =');
assert(start >= 0 && end > start, 'translation engine boundaries');
const { DICT, translate } = vm.runInNewContext(source.slice(start, end) + '\n({ DICT, translate })');
const folded = new Map();
for (const [english, chinese] of DICT) {
  assert.equal(translate(english), chinese, english);
  assert.equal(translate(chinese), chinese, `Repeated translation: ${english}`);
  const key = english.toLowerCase();
  if (folded.has(key)) assert.equal(folded.get(key), chinese, `Case conflict: ${english}`);
  folded.set(key, chinese);
}
const cases = ['payment-order-cases.json', 'error-dialog-cases.json'].flatMap(file => JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8')));
for (const [english, chinese] of cases) {
  assert.equal(translate(english), chinese, english);
  assert.equal(translate(chinese), chinese, `Repeated template: ${english}`);
  assert.equal(translate(`  ${english}\n`), `  ${chinese}\n`, `Whitespace: ${english}`);
}
for (const value of ['May', 'June', 'Buyer+Gift@Example.com', '$1,234.50', 'WTEST-123', '•••• 5678', '12/2028', '123 Example Street']) {
  assert.equal(translate(value), value, `Preserved value: ${value}`);
}
console.log(`PASS: ${DICT.length} dictionary entries, ${cases.length} message templates, stability and data preservation`);
