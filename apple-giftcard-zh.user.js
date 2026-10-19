// ==UserScript==
// @name         Apple 美国商店购物及结账中文翻译
// @name:zh-CN   Apple 美国商店购物及结账中文翻译
// @name:en      Apple Store and Checkout Simplified Chinese
// @namespace    local.apple-giftcard-zh
// @homepageURL  https://github.com/1clxiso/gm-scripts
// @supportURL   https://github.com/1clxiso/gm-scripts/issues
// @updateURL    https://raw.githubusercontent.com/1clxiso/gm-scripts/main/apple-giftcard-zh.user.js
// @downloadURL  https://raw.githubusercontent.com/1clxiso/gm-scripts/main/apple-giftcard-zh.user.js
// @version      1.2.5
// @description  翻译 Apple 美国商店、礼品卡、购物袋、登录、配送、付款及订单页面，支持动态内容与中英文切换。
// @match        https://www.apple.com/shop/*
// @match        https://www.apple.com/us/shop/*
// @match        https://*.store.apple.com/*
// @match        https://store.apple.com/*
// @match        https://idmsa.apple.com/appleauth/*
// @match        https://account.apple.com/*
// @match        https://appleid.apple.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // 启动与遍历结构参考用户提供的脚本：
  // https://raw.githubusercontent.com/luestr/userscripts/main/i18n/decrypt.34306.lol-zh-CN.user.js
  // document-start → 首屏扫描 → MutationObserver → 短时补扫。
  // 翻译仅操作文本节点和展示属性，不修改表单 value，也不接管网页原型。
  const DICT = [
    ['Buy Apple Gift Card', '购买 Apple 礼品卡'],
    ['Buy Apple Gift Cards', '购买 Apple 礼品卡'],
    ['Buy Apple Gift Cards - Apple', '购买 Apple 礼品卡 - Apple'],
    ['Apple Gift Card', 'Apple 礼品卡'],
    ['Apple Gift Cards', 'Apple 礼品卡'],
    ['Use it to shop the App Store, Apple TV, Apple Music, iTunes, Apple Arcade, the Apple Store app, apple.com, and the Apple Store.', '可用于 App Store、Apple TV、Apple Music、iTunes、Apple Arcade、Apple Store App、apple.com 和 Apple Store 零售店。'],
    ['How would you like to send it?', '你想如何送出礼品卡？'],
    ['Choose to send by mail and get a collectible sticker.', '选择邮寄，可获赠收藏贴纸。'],
    ['Email', '电子邮件'], ['Mail', '邮寄'],
    ['Choose a design.', '选择卡面设计。'], ['Choose a design', '选择卡面设计'],
    ['Choose an amount.', '选择金额。'], ['Choose an amount', '选择金额'],
    ['Other Amount', '其他金额'], ['Currency USD', '币种：美元（USD）'],
    ['Enter your delivery details.', '填写配送信息。'],
    ["Who’s it for?", '送给谁？'], ["Who's it for?", '送给谁？'],
    ["Who’s it from?", '由谁送出？'], ["Who's it from?", '由谁送出？'],
    ['Recipient Name', '收件人姓名'], ['Recipient Email Address', '收件人电子邮箱'],
    ['Recipient Email', '收件人电子邮箱'], ['Sender Name', '发件人姓名'],
    ['Sender Email Address', '发件人电子邮箱'], ['Sender Email', '发件人电子邮箱'],
    ['Want to add a personalized message?', '想添加专属祝福语吗？'],
    ['Add your message', '添加祝福语'], ['Add message', '添加祝福语'],
    ['No message', '不添加祝福语'], ['Your message', '你的祝福语'],
    ['Message', '祝福语'], ['Optional', '选填'], ['(Optional)', '（选填）'],
    ['Usually arrives within 1 hour', '通常在 1 小时内送达'],
    ['Select', '选择'], ['Continue', '继续'], ['Add to Bag', '加入购物袋'],
    ['Review', '查看'], ['Edit', '编辑'], ['Done', '完成'], ['Cancel', '取消'],
    ['Close', '关闭'], ['Save', '保存'], ['Remove', '移除'],
    ['Need a moment?', '需要再考虑一下？'],
    ['Keep all your selections by saving this device to Your Saves, then come back anytime and pick up right where you left off.', '将当前选择保存到收藏，方便随时回来继续。'],
    ['Save for later', '保存以便稍后查看'], ['Your Saves', '你的收藏'],
    ['Need some help?', '需要帮助？'], ['Call', '致电'],
    ['Where can I use my Apple Gift Card?', 'Apple 礼品卡可以用在哪里？'],
    ['Store', '商店'], ['Home', '家居'], ['Entertainment', '娱乐'],
    ['Accessories', '配件'], ['Support', '支持'], ['Shopping Bag', '购物袋'],
    ['Bag', '购物袋'], ['Search apple.com', '搜索 apple.com'], ['Search', '搜索'],
    ['Menu', '菜单'], ['Global', '全站导航'], ['Local', '本页导航'],
    ['Music', '音乐'], ['Books', '图书'],
    ['Shop and Learn', '选购及了解'], ['Apple Wallet', 'Apple 钱包'],
    ['Account', '账户'], ['For Business', '商务应用'], ['For Education', '教育应用'],
    ['For Healthcare', '医疗健康'], ['For Government', '政府应用'],
    ['Apple Values', 'Apple 价值观'], ['About Apple', '关于 Apple'],
    ['More Apple Store Links', '更多 Apple Store 链接'],
    ['United States', '美国'], ['Privacy Policy', '隐私政策'],
    ['Terms of Use', '使用条款'], ['Sales and Refunds', '销售及退款'],
    ['Legal', '法律信息'], ['Site Map', '网站地图'],
    ['Footer', '页脚'], ['footnotes', '附注'], ['Breadcrumbs', '导航路径'],
    ['More ways to shop:', '更多选购方式：'], ['Find an Apple Store', '查找 Apple Store 零售店'],
    ['other retailer', '其他零售商'], ['or', '或'], ['near you. Or call', '，或致电'],
    ['Apple Support', 'Apple 支持'], ['(Opens in a new window)', '（在新窗口中打开）'],
    ['here', '此处'],
    ['Beware of gift card scams. Do not share your code.', '谨防礼品卡诈骗。请勿向他人透露兑换码。'],
    ['Valid only for U.S. transactions in Apple properties. For assistance, visit', '仅适用于美国地区的 Apple 交易。如需帮助，请访问'],
    ['or call 800-275-2273. Not redeemable at Apple resellers or for cash, and no resale, refunds, or exchanges, except as required by law. Apple is not responsible for unauthorized use. Terms apply; see', '或致电 800-275-2273。不可在 Apple 经销商处兑换或兑换现金，除法律要求外，不可转售、退款或换货。Apple 对未经授权的使用不承担责任。适用条款请参阅'],
    ['CAUTION. Gift Cards are for gifts, NOT demands for payment, emergency or otherwise.', '注意：礼品卡用于赠礼，不用于应对任何付款要求，包括紧急付款要求。'],
    ['Maryland Residents: Report incidents to the MD Consumer Protection Division at 1-888-743-0023.', '马里兰州居民：如需举报，请拨打马里兰州消费者保护部门电话 1-888-743-0023。'],
    ['New Jersey Residents: Report incidents to the NJ Division of Consumer Affairs at 1-800-242-5846.', '新泽西州居民：如需举报，请拨打新泽西州消费者事务部门电话 1-800-242-5846。'],
    ['Be wary of any requests for payment via gift cards - no legitimate business or government agency will ever ask for payment (such as for utility bills, bail, or to pay traffic tickets or tolls) in the form of gift cards. If that is why you are purchasing a gift card - pause and think twice.', '警惕任何要求使用礼品卡付款的请求。正规企业或政府机构不会要求用礼品卡支付水电费、保释金、交通罚单或通行费等。如果你因此购买礼品卡，请暂停并慎重考虑。'],
    ['DO NOT give gift card information - including via phone, text, email, or photo - to pay bills or fees, or to fix any other problem. Gift cards are not meant for cash transfers.', '不要通过电话、短信、电子邮件或照片等方式提供礼品卡信息，以支付账单、费用或解决其他问题。礼品卡不用于现金转账。'],
    ['If you received an urgent call, text, or email from a co-worker, family member, or friend, asking for a gift card, reach out to that person directly to confirm that they need your help. If a caller told you to lie to a store clerk about why you are purchasing gift cards, this is likely a scam.', '如果同事、家人或朋友通过紧急电话、短信或邮件索要礼品卡，请直接联系本人核实。如果来电者要求你向店员隐瞒购买礼品卡的原因，这很可能是诈骗。'],
    ['Before buying a gift card, check to see if the packaging has been tampered with and ensure the PIN on the back of the card is not visible (it should be covered by a scratch-off seal). Keep the receipt or the gift card ID number to file a report if you lose the gift card or suspect fraud.', '购买前请检查包装是否被拆动，并确保卡背面的 PIN 码被刮刮涂层遮盖。请保留收据或礼品卡编号，以便在丢失礼品卡或怀疑遭遇诈骗时举报。'],
    ['IF YOU SUSPECT YOU HAVE BEEN THE VICTIM OF A GIFT CARD SCAM OR SUSPECT GIFT CARD FRAUD, REPORT IT TO:', '如果你怀疑遭遇礼品卡诈骗或发现礼品卡欺诈，请向以下机构举报：'],
    ['The Federal Trade Commission', '美国联邦贸易委员会'],
    ['The Federal Bureau of Investigation’s Internet Crime Complaint Center', '美国联邦调查局互联网犯罪投诉中心'],
    ['The New Jersey Division of Consumer Affairs', '新泽西州消费者事务部门'],
    ['Your local police department who can issue a police report that may help you work with the card issuer to obtain a refund.', '当地警察部门可出具报案记录，可能有助于你向发卡机构申请退款。'],
    ['We approximate your location from your internet IP address by matching it to a geographic region or from the location entered during your previous visit to Apple.', '我们通过将你的 IP 地址匹配到地理区域，或根据你上次访问 Apple 时输入的位置，估算你的位置。'],
    ['Please enter a valid email address.', '请输入有效的电子邮箱地址。'],
    ['Please enter a name.', '请输入姓名。'], ['This field is required.', '此项为必填。'],
    ['Please enter an amount.', '请输入金额。'],
    ['Apple logo containing bright multicolor 3D geometric design, triangles of red, pink, purple, blue, green, and orange', 'Apple 标志：红、粉、紫、蓝、绿、橙色三角形组成的立体彩色几何图案'],
    ['Apple logo containing camouflage pattern, gradient sky blue, teal, purple, and black', 'Apple 标志：天蓝、青绿、紫、黑色渐变迷彩图案'],
    ['Apple logo cotaining multicolor abstract splashes and pixels, neon pink, red, orange, blue, and yellow', 'Apple 标志：粉、红、橙、蓝、黄色抽象飞溅和像素图案'],
    ['Apple logo containing pattern of circles and thick rounded lines, repeating colorblocks of lilac purple, dark green, and neon yellow', 'Apple 标志：淡紫、深绿、荧光黄色圆形和粗圆线条图案'],
    ['Apple logo containing abstract swirled multicolor design, spectrum of bright and dark shades', 'Apple 标志：明暗交织的彩色抽象旋涡图案'],

    // 购物袋、访客结账、登录、配送、付款及订单页面。
    ["Bag - Apple", "购物袋 - Apple"],
    ["Checkout - Apple", "结账 - Apple"],
    ["Check Out - Apple", "结账 - Apple"],
    ["Secure Checkout - Apple", "安全结账 - Apple"],
    ["Sign In - Apple", "登录 - Apple"],
    ["Your bag is empty.", "你的购物袋是空的。"],
    ["Sign in to see if you have any saved items. Or continue shopping.", "登录以查看已保存的商品，或继续选购。"],
    ["Free delivery and free returns.", "免费配送，免费退货。"],
    ["Free shipping and free returns.", "免费配送，免费退货。"],
    ["Check Out", "结账"],
    ["Checkout", "结账"],
    ["Check out with Pay", "使用 Apple Pay 结账"],
    ["Check Out with Apple Pay", "使用 Apple Pay 结账"],
    ["Check Out with", "结账方式："],
    ["Check out with Pay", "使用 Pay 结账"],
    ["Pay with Apple Pay", "使用 Apple Pay 付款"],
    ["Buy with Apple Pay", "使用 Apple Pay 购买"],
    ["Check out with other payment options", "使用其他付款方式结账"],
    ["Checkout with other payment options", "使用其他付款方式结账"],
    ["Review Bag", "查看购物袋"],
    ["View Bag", "查看购物袋"],
    ["Your Bag", "你的购物袋"],
    ["Review your bag.", "查看你的购物袋。"],
    ["Continue Shopping", "继续选购"],
    ["Continue to Checkout", "继续结账"],
    ["Apple Gift Card by Mail", "邮寄 Apple 礼品卡"],
    ["Apple Gift Card by Email", "电子 Apple 礼品卡"],
    ["Your gift card message", "你的礼品卡祝福语"],
    ["None", "无"],
    ["In stock and ready to ship.", "现货，可发货。"],
    ["None In stock and ready to ship. Apple Store Pickup is currently unavailable", "无。现货，可发货。目前不支持 Apple Store 到店取货。"],
    ["Apple Store Pickup is currently unavailable", "目前不支持 Apple Store 到店取货"],
    ["Subtotal", "小计"],
    ["Shipping", "配送"],
    ["Shipping:", "配送："],
    ["Delivery", "配送"],
    ["Delivery:", "配送："],
    ["Shipping & Handling", "运费及手续费"],
    ["Shipping and handling", "运费及手续费"],
    ["Free Shipping", "免费配送"],
    ["Free Delivery", "免费配送"],
    ["FREE", "免费"],
    ["In Stock", "有现货"],
    ["Total", "合计"],
    ["Total:", "合计："],
    ["Order Total", "订单总计"],
    ["Estimated Total", "预估总计"],
    ["Tax", "税费"],
    ["Estimated Tax", "预估税费"],
    ["Estimated tax for:", "预估税费地区："],
    ["Estimated tax", "预估税费"],
    ["Sales Tax", "销售税"],
    ["Estimated Sales Tax", "预估销售税"],
    ["Calculate", "计算"],
    ["Quantity", "数量"],
    ["Qty", "数量"],
    ["Qty:", "数量："],
    ["Item", "商品"],
    ["Items", "商品"],
    ["Discount", "优惠"],
    ["Discounts", "优惠"],
    ["Savings", "优惠金额"],
    ["Promotion Code", "优惠码"],
    ["Promo Code", "优惠码"],
    ["Apply", "应用"],
    ["Apply Gift Card", "使用礼品卡"],
    ["Gift Card", "礼品卡"],
    ["Gift Cards", "礼品卡"],
    ["Gift card PIN", "礼品卡 PIN 码"],
    ["PIN", "PIN 码"],
    ["Redeem", "兑换"],
    ["Balance", "余额"],
    ["Get Daily Cash with Apple Card", "使用 Apple Card 获取 Daily Cash 返现"],
    ["Get delivery dates", "查看送达日期"],
    ["Delivery options", "配送选项"],
    ["Delivery Options", "配送选项"],
    ["Delivery method", "配送方式"],
    ["Shipping Method", "配送方式"],
    ["Standard Delivery", "标准配送"],
    ["Standard Shipping", "标准配送"],
    ["Express Shipping", "加急配送"],
    ["Express Delivery", "加急配送"],
    ["Delivery Details", "配送信息"],
    ["Shipping Details", "配送信息"],
    ["Delivery Address", "配送地址"],
    ["Shipping Address", "收货地址"],
    ["Ship to", "配送至"],
    ["Ship to:", "配送至："],
    ["Deliver to", "配送至"],
    ["Deliver to:", "配送至："],
    ["Where should we send your order?", "你的订单要送到哪里？"],
    ["Where should we deliver your order?", "你的订单要送到哪里？"],
    ["Where would you like your order delivered?", "你希望订单送到哪里？"],
    ["Where do you want to pick up your order?", "你想在哪里领取订单？"],
    ["How would you like to get your order?", "你想如何收取订单？"],
    ["How would you like to receive your order?", "你想如何收取订单？"],
    ["Choose a delivery method.", "选择配送方式。"],
    ["Choose your delivery options.", "选择配送选项。"],
    ["Continue to Shipping Address", "继续填写收货地址"],
    ["Continue to Delivery", "继续选择配送"],
    ["Continue to Billing", "继续填写账单信息"],
    ["Continue to Payment", "继续选择付款方式"],
    ["Continue to Review", "继续核对订单"],
    ["Continue to Order Review", "继续查看订单"],
    ["Pickup", "到店取货"],
    ["Pick up", "到店取货"],
    ["Pick Up", "到店取货"],
    ["Apple Store Pickup", "Apple Store 到店取货"],
    ["Pickup Details", "取货信息"],
    ["Pickup Contact", "取货联系人"],
    ["Choose a Store", "选择零售店"],
    ["Find a Store", "查找零售店"],
    ["Check availability", "查看库存"],
    ["Available", "有货"],
    ["Unavailable", "暂不可用"],
    ["Not available", "暂不可用"],
    ["Contact Information", "联系信息"],
    ["Contact Details", "联系信息"],
    ["Contact", "联系人"],
    ["Who’s picking up your order?", "谁来领取订单？"],
    ["Who's picking up your order?", "谁来领取订单？"],
    ["First Name", "名字"],
    ["Last Name", "姓氏"],
    ["Full Name", "姓名"],
    ["Name", "姓名"],
    ["Company Name", "公司名称"],
    ["Company", "公司"],
    ["Street Address", "街道地址"],
    ["Address", "地址"],
    ["Address Line 1", "地址第 1 行"],
    ["Address Line 2", "地址第 2 行"],
    ["Street Address 2", "街道地址第 2 行"],
    ["Apartment, suite, building, etc.", "公寓、套房、楼栋等"],
    ["Apt, Suite, Building (Optional)", "公寓、套房、楼栋（选填）"],
    ["Apt, Suite, Building", "公寓、套房、楼栋"],
    ["Apartment/Suite", "公寓／套房"],
    ["City", "城市"],
    ["State", "州"],
    ["State/Province", "州／省"],
    ["ZIP Code", "邮政编码"],
    ["Zip Code", "邮政编码"],
    ["ZIP code", "邮政编码"],
    ["Postal Code", "邮政编码"],
    ["ZIP", "邮政编码"],
    ["Country", "国家"],
    ["Country/Region", "国家／地区"],
    ["Country or Region", "国家或地区"],
    ["Phone", "电话"],
    ["Phone Number", "电话号码"],
    ["Mobile Phone", "手机号码"],
    ["Mobile Phone Number", "手机号码"],
    ["Daytime Phone", "日间联系电话"],
    ["Area Code", "区号"],
    ["Extension", "分机号"],
    ["Email Address", "电子邮箱地址"],
    ["Email address", "电子邮箱地址"],
    ["Confirm Email Address", "确认电子邮箱地址"],
    ["Use this address", "使用此地址"],
    ["Use This Address", "使用此地址"],
    ["Add a new address", "添加新地址"],
    ["Add New Address", "添加新地址"],
    ["Edit Address", "编辑地址"],
    ["Save Address", "保存地址"],
    ["Suggested Address", "建议地址"],
    ["You Entered", "你输入的地址"],
    ["Use Suggested Address", "使用建议地址"],
    ["Use Original Address", "使用原地址"],
    ["Verify your address", "核实你的地址"],
    ["Billing", "账单"],
    ["Billing Address", "账单地址"],
    ["Billing Information", "账单信息"],
    ["Billing Details", "账单信息"],
    ["Same as shipping address", "与收货地址相同"],
    ["Same as delivery address", "与配送地址相同"],
    ["Use a different billing address", "使用其他账单地址"],
    ["Payment", "付款"],
    ["Payment Method", "付款方式"],
    ["Payment Methods", "付款方式"],
    ["Payment Information", "付款信息"],
    ["Payment Details", "付款信息"],
    ["How would you like to pay?", "你想如何付款？"],
    ["How do you want to pay?", "你想如何付款？"],
    ["Choose a payment method.", "选择付款方式。"],
    ["Select a payment method", "选择付款方式"],
    ["Credit or Debit Card", "信用卡或借记卡"],
    ["Credit/Debit Card", "信用卡／借记卡"],
    ["Credit Card", "信用卡"],
    ["Debit Card", "借记卡"],
    ["Card Number", "卡号"],
    ["Credit Card Number", "信用卡卡号"],
    ["Name on Card", "持卡人姓名"],
    ["Cardholder Name", "持卡人姓名"],
    ["Expiration Date", "有效期"],
    ["Expiry Date", "有效期"],
    ["Expiration", "有效期"],
    ["Month", "月"],
    ["Year", "年"],
    ["MM/YY", "月／年"],
    ["MM / YY", "月／年"],
    ["Security Code", "安全码"],
    ["CVV", "CVV 安全码"],
    ["CVV/CVC", "CVV／CVC 安全码"],
    ["What is this?", "这是什么？"],
    ["Add a card", "添加银行卡"],
    ["Use a different card", "使用其他银行卡"],
    ["Other payment options", "其他付款方式"],
    ["Pay in Full", "一次性付清"],
    ["Pay Monthly", "按月付款"],
    ["Monthly Installments", "每月分期付款"],
    ["Pay Now", "立即付款"],
    ["Pay Later", "稍后付款"],
    ["Review Your Order", "查看你的订单"],
    ["Review your order.", "查看你的订单。"],
    ["Review Order", "查看订单"],
    ["Order Review", "订单核对"],
    ["Order Summary", "订单摘要"],
    ["Order Details", "订单详情"],
    ["Order Information", "订单信息"],
    ["Place Your Order", "提交订单"],
    ["Place Order", "提交订单"],
    ["Complete Order", "完成订单"],
    ["Complete Purchase", "完成购买"],
    ["Confirm Order", "确认订单"],
    ["Confirm Purchase", "确认购买"],
    ["Submit Order", "提交订单"],
    ["Confirm and Pay", "确认并付款"],
    ["Buy Now", "立即购买"],
    ["Processing", "处理中"],
    ["Processing…", "处理中…"],
    ["Processing...", "处理中…"],
    ["Please wait", "请稍候"],
    ["Please wait...", "请稍候…"],
    ["Loading", "正在加载"],
    ["Loading...", "正在加载…"],
    ["Loading…", "正在加载…"],
    ["Back", "返回"],
    ["Go Back", "返回"],
    ["Change", "更改"],
    ["Change Delivery", "更改配送方式"],
    ["Change Payment", "更改付款方式"],
    ["Show Details", "显示详情"],
    ["Hide Details", "隐藏详情"],
    ["Show More", "显示更多"],
    ["Show Less", "收起"],
    ["Learn More", "进一步了解"],
    ["Yes", "是"],
    ["No", "否"],
    ["Required", "必填"],
    ["Required field", "必填项"],
    ["Please enter your first name.", "请输入你的名字。"],
    ["Please enter your last name.", "请输入你的姓氏。"],
    ["Please enter a valid ZIP Code.", "请输入有效的邮政编码。"],
    ["Please enter a valid zip code.", "请输入有效的邮政编码。"],
    ["Please enter a valid phone number.", "请输入有效的电话号码。"],
    ["Please enter a valid card number.", "请输入有效的卡号。"],
    ["Please enter a valid security code.", "请输入有效的安全码。"],
    ["Please check your information and try again.", "请检查所填信息，然后重试。"],
    ["Something went wrong.", "出现错误。"],
    ["Please try again.", "请重试。"],
    ["Try Again", "重试"],
    ["Your session has expired.", "你的会话已过期。"],
    ["Your payment could not be processed.", "无法处理你的付款。"],
    ["Thank you.", "谢谢。"],
    ["Thank you for your order.", "感谢你的订购。"],
    ["Thanks for your order.", "感谢你的订购。"],
    ["Your order has been placed.", "你的订单已提交。"],
    ["Order Confirmation", "订单确认"],
    ["Confirmation", "确认"],
    ["Order Number", "订单编号"],
    ["Order number:", "订单编号："],
    ["Order Status", "订单状态"],
    ["Track Shipment", "跟踪配送"],
    ["Track Order", "跟踪订单"],
    ["View Order", "查看订单"],
    ["Print", "打印"],
    ["Print Receipt", "打印收据"],
    ["Sign In", "登录"],
    ["Sign in to Apple Store", "登录 Apple Store"],
    ["Sign in with your Apple Account", "使用 Apple 账户登录"],
    ["Sign in with your Apple ID", "使用 Apple ID 登录"],
    ["Apple Account", "Apple 账户"],
    ["Apple ID", "Apple ID"],
    ["Email or Phone Number", "邮箱或电话号码"],
    ["Email or phone number", "邮箱或电话号码"],
    ["Password", "密码"],
    ["Remember me", "记住我"],
    ["Keep me signed in", "保持登录状态"],
    ["Forgot password?", "忘记密码？"],
    ["Forgot your Apple ID or password?", "忘记 Apple ID 或密码？"],
    ["Forgot Apple Account or password?", "忘记 Apple 账户或密码？"],
    ["Create Your Apple Account", "创建你的 Apple 账户"],
    ["Create Your Apple ID", "创建你的 Apple ID"],
    ["Continue as Guest", "以访客身份继续"],
    ["Check Out as Guest", "以访客身份结账"],
    ["Guest Checkout", "访客结账"],
    ["Guest", "访客"],
    ["Two-Factor Authentication", "双重认证"],
    ["Verification Code", "验证码"],
    ["Enter verification code", "输入验证码"],
    ["Didn't get a verification code?", "没有收到验证码？"],
    ["Didn’t get a verification code?", "没有收到验证码？"],
    ["Trust This Browser?", "信任此浏览器？"],
    ["Trust", "信任"],
    ["Don't Trust", "不信任"],
    ["Don’t Trust", "不信任"],
    ["Resend Code", "重新发送验证码"],
    ["Terms and Conditions", "条款和条件"],
    ["Terms & Conditions", "条款和条件"],
    ["I agree", "我同意"],
    ["I Agree", "我同意"],
    ["By placing your order, you agree to Apple's Terms and Conditions.", "提交订单即表示你同意 Apple 的条款和条件。"],
    ["New Arrivals", "新品上架"],
    ["Check out the latest accessories.", "选购最新配件。"],
    ["Shop New Arrivals", "选购新品"],
    ["Questions About Buying", "购买常见问题"],
    ["You may also like", "你可能还喜欢"],
    ["Only at Apple", "Apple 独家"],
    ["Show more products", "显示更多商品"],
    ["Chat now", "立即在线交流"],
    ["Overview", "概览"],
    ["Pre-Order", "预购"],
    ["Have an iPhone saved for pre-order?", "已保存待预购的 iPhone？"],
    ["Manage Your Apple Account", "管理你的 Apple 账户"],
    ["Apple Store Account", "Apple Store 账户"],
    ["Shopping Help", "购物帮助"],
    ["Wallet", "钱包"],
    ["Certified Refurbished", "认证翻新产品"],
    ["Financing", "分期付款"],
    ["Contact Apple", "联系 Apple"],
    ["Accessibility", "辅助功能"],
    ["Education", "教育"],
    ["Environment", "环境"],
    ["Privacy", "隐私"],
    ["Newsroom", "新闻发布室"],
    ["Sign In — Secure Checkout - Apple", "登录 — 安全结账 - Apple"],
    ["Sign in for faster checkout.", "登录，结账更快捷。"],
    ["Check out with your Apple Account", "使用 Apple 账户结账"],
    ["Proceed and create an Apple Account later.", "先继续结账，稍后再创建 Apple 账户。"],
    ["The Apple Online Store uses industry-standard encryption to protect the confidentiality of the information you submit. Learn more about our", "Apple 在线商店采用行业标准加密技术，保护你提交的信息。进一步了解我们的"],
    ["Security Policy", "安全政策"],
    ["Not now", "暂不"],
    ["Your order", "你的订单"],
    ["Edit gift message on card for Apple Gift Card by Mail", "编辑邮寄 Apple 礼品卡的祝福语"],
    ["Quantity for Apple Gift Card by Mail", "邮寄 Apple 礼品卡数量"],
    ["Remove Apple Gift Card by Mail", "移除邮寄 Apple 礼品卡"],
    ["Save for later Apple Gift Card by Mail", "保存邮寄 Apple 礼品卡以便稍后查看"],
    ["Your delivery details", "你的配送信息"],
    ["Order Options — Secure Checkout", "订单选项 — 安全结账"],
    ["Shipping Address — Secure Checkout", "收货地址 — 安全结账"],
    ["Payment — Secure Checkout", "付款 — 安全结账"],
    ["Review — Secure Checkout", "核对订单 — 安全结账"],
    ["Order Confirmation - Apple", "订单确认 - Apple"],
    ["Get your order options", "选择收取订单的方式"],
    ["I’d like it delivered", "我要配送到家"],
    ["I'd like it delivered", "我要配送到家"],
    ["I’ll pick it up", "我要到店取货"],
    ["I'll pick it up", "我要到店取货"],
    ["Enter a zip code to get delivery options.", "输入邮政编码以查看配送选项。"],
    ["Apply Zip Code", "应用邮政编码"],
    ["Save my location for future visits", "保存我的位置，供下次访问使用"],
    ["FAQ for Delivery & Pickup", "配送与取货常见问题"],
    ["Apple uses industry-standard encryption to protect the confidentiality of your personal information.", "Apple 采用行业标准加密技术，保护你的个人信息。"],
    ["Show Order Summary", "显示订单摘要"],
    ["Hide Order Summary", "隐藏订单摘要"],
    ["Delivery dates", "送达日期"],
    ["Items to be shipped", "待配送商品"],
    ["To:", "收件人："],
    ["From:", "发件人："],
    ["Scheduled delivery", "预约配送"],
    ["Select delivery date", "选择送达日期"],
    ["Send date", "发送日期"],
    ["Today", "今天"],
    ["Tomorrow", "明天"],
    ["How should we contact you?", "我们应如何联系你？"],
    ["Where should we send your receipt?", "收据要发送到哪里？"],
    ["Where should we email your receipt?", "电子收据要发送到哪个邮箱？"],
    ["Enter your payment details.", "填写付款信息。"],
    ["Enter your billing address.", "填写账单地址。"],
    ["Check your order details.", "核对订单信息。"],
    ["Please review your order.", "请核对你的订单。"],
    ["Tax will be calculated at checkout.", "税费将在结账时计算。"],
    ["Estimated tax will be calculated at checkout.", "预估税费将在结账时计算。"],
    ["Secure Checkout", "安全结账"],
    ["Email Delivery", "电子邮件配送"],
    ["Delivered by email", "通过电子邮件送达"],
    ["Send by email", "通过电子邮件发送"],
    ["Add a gift message", "添加礼品祝福语"],
    ["Gift Message", "礼品祝福语"],
    ["Your message will appear here.", "你的祝福语将显示在这里。"],
    ["Order Placed", "订单已提交"],
    ["Order Received", "订单已收到"],
    ["We’re processing your order.", "我们正在处理你的订单。"],
    ["We're processing your order.", "我们正在处理你的订单。"],
    ["Your order is being processed.", "你的订单正在处理中。"],
    ["Preparing to Ship", "正在准备发货"],
    ["Shipped", "已发货"],
    ["Delivered", "已送达"],
    ["Canceled", "已取消"],
    ["Cancelled", "已取消"],
    ["Cancel Order", "取消订单"],
    ["Return to Bag", "返回购物袋"],
    ["Back to Bag", "返回购物袋"],
    ["Close Notification", "关闭通知"],
    ["Delivers to:", "配送至："],
    ["Select your delivery method: Apple Gift Card by Mail", "选择邮寄 Apple 礼品卡的配送方式"],
    ["Keep this in mind about your selection:", "请留意所选配送方式的以下事项："],
    ["The carrier may require a signature upon delivery.", "承运商可能要求收件时签名。"],
    ["In-Transit Options: Once your order has been shipped, you can use your tracking link to redirect your shipment to a pickup point, hold it at a secure location, or fill out a signature waiver or shipment release.", "运输途中选项：订单发货后，可通过物流跟踪链接将包裹转送至取件点、暂存至安全地点，或填写免签收或包裹放行授权。"],
    ["View Apple Shipping Policy", "查看 Apple 配送政策"],
    ["Continue to shipping and fulfillment", "继续填写配送信息"],
    ["Continue to billing and payment", "继续填写账单与付款信息"],
    ["Continue to review", "继续核对订单"],
    ["Shipping & Fulfillment", "配送与收货"],
    ["Billing & Payment", "账单与付款"],
    ["Use a credit or debit card", "使用信用卡或借记卡"],
    ["Enter a gift card", "输入礼品卡信息"],
    ["Enter a gift card PIN", "输入礼品卡 PIN 码"],
    ["Your gift card balance", "你的礼品卡余额"],
    ["Shipping Details — Secure Checkout", "配送信息 — 安全结账"],
    ["Your delivery zip code has changed. To continue with your selected delivery dates, your zip code and address must match.", "你的配送邮政编码已更改。若要保留所选送达日期，邮政编码必须与收货地址一致。"],
    ["Enter your name and address:", "填写你的姓名和地址："],
    ["Apartment, Suite, Building (Optional)", "公寓、套房、楼栋（选填）"],
    ["City, State", "城市、州"],
    ["Other", "其他"],
    ["This is a business address.", "这是公司地址。"],
    ["Business shipments are usually delivered Monday through Friday from 8:00 a.m. to 6:00 p.m. and residential shipments are usually delivered Monday through Saturday from 8:00 a.m. to 6:00 p.m.", "公司地址通常于周一至周五上午 8 点至下午 6 点配送；住宅地址通常于周一至周六上午 8 点至下午 6 点配送。"],
    ["What’s your contact information?", "你的联系信息是什么？"],
    ["What's your contact information?", "你的联系信息是什么？"],
    ["We’ll email you a receipt and send order updates to your mobile phone via SMS or iMessage.", "我们会通过电子邮件发送收据，并通过短信或 iMessage 向你的手机发送订单更新。"],
    ["The phone number you enter can’t be changed after you place your order, so please make sure it’s correct.", "订单提交后无法更改你填写的电话号码，请确保号码正确。"],
    ["Share shipping updates with someone else:", "与其他人分享配送更新："],
    ["Enter an email address", "输入电子邮箱地址"],
    ["FAQ for Shipping", "配送常见问题"],
    ["FAQ for Payment", "付款常见问题"],
    ["Order now.", "立即订购。"],
    ["Pick up in-store:", "到店取货："],
    ["Undo", "撤销"],
    ["The gift card for everything Apple", "一张礼品卡，畅享 Apple 的精彩"],
    ["Enter your message", "输入你的祝福语"],
    ["Personal Message", "专属祝福语"],
    ["Personalized Message", "专属祝福语"],
    ["Gift card message", "礼品卡祝福语"],
    ["Add a personalized message", "添加专属祝福语"],
    ["Edit gift message", "编辑礼品祝福语"],
    ["Characters remaining", "剩余可输入字符数"],
    ["Send another gift card", "再送一张礼品卡"],
    ["Add another gift card", "再添加一张礼品卡"],
    ["Apple Gift Card by Mail removed from your bag. Any associated offers have also been removed.", "邮寄 Apple 礼品卡已从购物袋移除，相关优惠也已移除。"],
    ["Apple Gift Card by Email removed from your bag. Any associated offers have also been removed.", "电子 Apple 礼品卡已从购物袋移除，相关优惠也已移除。"],
    ["Estimated Delivery", "预计送达"],
    ["Business Days", "工作日"],
    ["Business Day", "工作日"],
    ["Edit Zip code", "编辑邮政编码"],
    ["Order by", "请于以下时间前订购"],
    ["Expiration Month", "到期月份"],
    ["Expiration Year", "到期年份"],
    ["MM", "月"],
    ["YY", "年"],
    ["Security code (CVV)", "安全码（CVV）"],
    ["Security code (CVV/CVC)", "安全码（CVV／CVC）"],
    ["Use my shipping address", "使用我的收货地址"],
    ["Use shipping address as billing address", "使用收货地址作为账单地址"],
    ["Use a different address", "使用其他地址"],
    ["Add a payment method", "添加付款方式"],
    ["Remove payment method", "移除付款方式"],
    ["Please select a state.", "请选择州。"],
    ["Please select your state.", "请选择你的州。"],
    ["Please enter your street address.", "请输入你的街道地址。"],
    ["Please enter your city.", "请输入你的城市。"],
    ["Please enter your email address.", "请输入你的电子邮箱地址。"],
    ["Please enter your phone number.", "请输入你的电话号码。"],
    ["Please enter your card number.", "请输入你的卡号。"],
    ["Please enter a valid expiration date.", "请输入有效的到期日期。"],
    ["Your card has expired.", "你的银行卡已过期。"],
    ["Your card was declined.", "你的银行卡付款被拒绝。"],
    ["Check your payment details and try again.", "请检查付款信息后重试。"],
    ["Payment could not be authorized.", "付款未能获得授权。"],
    ["Payment Unsuccessful", "付款未成功"],
    ["Payment Failed", "付款失败"],
    ["Payment Successful", "付款成功"],
    ["Your order is confirmed.", "你的订单已确认。"],
    ["We’ve received your order.", "我们已收到你的订单。"],
    ["We've received your order.", "我们已收到你的订单。"],
    ["We’ll send you an email confirmation.", "我们会向你发送确认邮件。"],
    ["View your order", "查看你的订单"],
    ["Check Order Status", "查看订单状态"],
    ["Order Date", "订单日期"],
    ["Estimated Arrival", "预计到达"],
    ["Awaiting Payment", "等待付款"],
    ["Check your order status", "查看你的订单状态"],
    ["Verify your identity", "验证你的身份"],
    ["Enter your password", "输入你的密码"],
    ["Enter your verification code", "输入你的验证码"],
    ["Enter the verification code sent to your trusted devices.", "输入发送到受信任设备的验证码。"],
    ["Enter the verification code sent to your phone.", "输入发送到你手机上的验证码。"],
    ["Incorrect verification code.", "验证码不正确。"],
    ["This verification code has expired.", "此验证码已过期。"],
    ["Send a new code", "发送新验证码"],
    ["Text me", "向我发送短信"],
    ["Call me", "给我打电话"],
    ["More Options", "更多选项"],
    ["Not Now", "暂不"],
    ["Your Apple Account or password was incorrect.", "你的 Apple 账户或密码不正确。"],
    ["Your Apple ID or password was incorrect.", "你的 Apple ID 或密码不正确。"],
    ["Continue with Password", "使用密码继续"],
    ["Sign in with a different Apple Account", "使用其他 Apple 账户登录"],
    ["Use a different Apple Account", "使用其他 Apple 账户"],
    ["Forgot password? Opens in a new window.", "忘记密码？在新窗口中打开。"],
    ["Opens in a new window.", "在新窗口中打开。"],
    ["Legal - iTunes Gift Cards and Codes - Apple", "法律信息 - iTunes 礼品卡和兑换码 - Apple"],
    ["Apple Gift Card, removed from packaging, two white square cards, rounded corners, design on transparent sticker, Apple logo containing multicolor geometric design, Apple logo containing multicolor splashes and pixels", "拆开包装的 Apple 礼品卡：两张白色圆角方卡，透明贴纸上分别印有彩色几何图案与彩色飞溅像素图案的 Apple 标志"],
    ["TV & Home", "电视与家居"],
    ["Apple Store App", "Apple Store App"],
    ["Carrier Deals at Apple", "Apple 运营商优惠"],
    ["Apple and Business", "Apple 与商务"],
    ["Shop for Business", "商务选购"],
    ["Apple and Education", "Apple 与教育"],
    ["Shop for K-12", "中小学教育选购"],
    ["Shop for College", "高校教育选购"],
    ["Apple in Healthcare", "Apple 与医疗健康"],
    ["Health on Apple Watch", "Apple Watch 健康功能"],
    ["Health Records on iPhone", "iPhone 健康记录"],
    ["Shop for Government", "政府采购"],
    ["Shop for Veterans and Military", "退伍军人与军人选购"],
    ["Inclusion and Diversity", "包容性与多样性"],
    ["Racial Equity and Justice", "种族平等与公正"],
    ["Supply Chain", "供应链"],
    ["Apple Leadership", "Apple 管理层"],
    ["Career Opportunities", "工作机会"],
    ["Investors", "投资者关系"],
    ["Ethics & Compliance", "道德与合规"],
    ["Events", "活动"],
    ["Apple Camp", "Apple 夏令营"],
    ["Order Options", "订单选项"],
    // 付款与订单确认补充：包含候选文案；未通过实际付款逐项确认。
    ["How would you like to pay for your order?", "你想如何支付订单？"],
    ["How do you want to pay for your order?", "你想如何支付订单？"],
    ["Choose how you want to pay.", "选择你的付款方式。"],
    ["Enter your credit or debit card details.", "填写你的信用卡或借记卡信息。"],
    ["Credit or debit card information", "信用卡或借记卡信息"],
    ["Credit Cards or Debit Cards", "信用卡或借记卡"],
    ["Card Details", "银行卡信息"],
    ["Card Information", "银行卡信息"],
    ["Card Type", "银行卡类型"],
    ["Card", "银行卡"],
    ["Cardholder’s Name", "持卡人姓名"],
    ["Cardholder's Name", "持卡人姓名"],
    ["Cardholder First Name", "持卡人名字"],
    ["Cardholder Last Name", "持卡人姓氏"],
    ["Expiration (MM/YY)", "有效期（月／年）"],
    ["Expiration date (MM/YY)", "有效期（月／年）"],
    ["Expiration date (MM/YYYY)", "有效期（月／年）"],
    ["MM/YYYY", "月／年"],
    ["Security Code (CVV)", "安全码（CVV）"],
    ["Security Code (CVV2)", "安全码（CVV2）"],
    ["CVV2", "CVV2 安全码"],
    ["CID", "CID 安全码"],
    ["3-digit security code", "3 位安全码"],
    ["4-digit security code", "4 位安全码"],
    ["Enter the security code", "输入安全码"],
    ["The billing address must match the address on your card statement.", "账单地址必须与银行卡账单上的地址一致。"],
    ["Billing Contact", "账单联系人"],
    ["Billing Phone Number", "账单联系电话"],
    ["Billing ZIP Code", "账单邮政编码"],
    ["Edit Billing Address", "编辑账单地址"],
    ["Select a billing address", "选择账单地址"],
    ["Use this billing address", "使用此账单地址"],
    ["Add Billing Address", "添加账单地址"],
    ["Billing address is the same as shipping address", "账单地址与收货地址相同"],
    ["Same as my shipping address", "与我的收货地址相同"],
    ["Your payment information is secure.", "你的付款信息受到安全保护。"],
    ["Your payment details are encrypted.", "你的付款信息已加密。"],
    ["Save this card for future purchases", "保存此卡以供下次购买使用"],
    ["Save my payment information", "保存我的付款信息"],
    ["Do not save this card", "不保存此卡"],
    ["Use another payment method", "使用其他付款方式"],
    ["Change Payment Method", "更改付款方式"],
    ["Use Apple Pay", "使用 Apple Pay"],
    ["Continue with Apple Pay", "使用 Apple Pay 继续"],
    ["Set up Apple Pay", "设置 Apple Pay"],
    ["Apple Pay is not available.", "Apple Pay 暂不可用。"],
    ["Apple Pay payment was canceled.", "Apple Pay 付款已取消。"],
    ["Payment Canceled", "付款已取消"],
    ["Payment Cancelled", "付款已取消"],
    ["Continue with PayPal", "使用 PayPal 继续"],
    ["Pay with PayPal", "使用 PayPal 付款"],
    ["You will be redirected to PayPal to complete your purchase.", "你将前往 PayPal 完成购买。"],
    ["Return to Apple", "返回 Apple"],
    ["Apple Account Balance", "Apple 账户余额"],
    ["Use Apple Account Balance", "使用 Apple 账户余额"],
    ["Apply Apple Account Balance", "使用 Apple 账户余额"],
    ["Available Balance", "可用余额"],
    ["Remaining Balance", "剩余余额"],
    ["Remaining Amount", "剩余金额"],
    ["Amount Due", "应付金额"],
    ["Amount Paid", "已付金额"],
    ["Amount to Pay", "待付金额"],
    ["Payment Total", "付款总额"],
    ["Total Due Today", "今天应付总额"],
    ["Amount Due Today", "今天应付金额"],
    ["Paid with", "付款方式"],
    ["Paid by", "付款方式"],
    ["Charged to", "扣款银行卡"],
    ["Gift Card Balance", "礼品卡余额"],
    ["Gift Card Number", "礼品卡编号"],
    ["Gift Card PIN", "礼品卡 PIN 码"],
    ["Enter your gift card PIN", "输入你的礼品卡 PIN 码"],
    ["Apply a gift card", "使用礼品卡"],
    ["Add another gift card", "再添加一张礼品卡"],
    ["Remove Gift Card", "移除礼品卡"],
    ["Your gift card has been applied.", "你的礼品卡已使用。"],
    ["This gift card has already been applied.", "此礼品卡已使用。"],
    ["Please enter a valid gift card PIN.", "请输入有效的礼品卡 PIN 码。"],
    ["This gift card cannot be used for this purchase.", "此礼品卡无法用于本次购买。"],
    ["You cannot pay for an Apple Gift Card with an Apple Gift Card or Apple Account Balance.", "不能使用 Apple 礼品卡或 Apple 账户余额购买 Apple 礼品卡。"],
    ["There is not enough balance on this gift card.", "此礼品卡余额不足。"],
    ["Please check your card number and try again.", "请检查卡号后重试。"],
    ["Please check your security code and try again.", "请检查安全码后重试。"],
    ["Please check the expiration date.", "请检查到期日期。"],
    ["Your payment could not be authorized.", "你的付款未能获得授权。"],
    ["Your payment was declined.", "你的付款被拒绝。"],
    ["Please contact your card issuer.", "请联系你的发卡机构。"],
    ["Please use a different payment method.", "请使用其他付款方式。"],
    ["Payment authorization failed.", "付款授权失败。"],
    ["Additional verification required", "需要进一步验证"],
    ["Verify your payment", "验证你的付款"],
    ["Authentication required", "需要身份验证"],
    ["Authentication failed", "身份验证失败"],
    ["Payment verification failed.", "付款验证失败。"],
    ["Payment Pending", "等待付款"],
    ["Payment Processing", "付款处理中"],
    ["Awaiting Authorization", "等待授权"],
    ["Authorization Pending", "等待授权"],
    ["Payment Authorized", "付款已授权"],
    ["Payment Complete", "付款已完成"],
    ["Payment Received", "已收到付款"],
    ["Payment Status", "付款状态"],
    ["Please do not close this window.", "请勿关闭此窗口。"],
    ["Please do not refresh this page.", "请勿刷新此页面。"],
    ["We’re processing your payment.", "我们正在处理你的付款。"],
    ["We're processing your payment.", "我们正在处理你的付款。"],
    ["Review and place your order.", "核对并提交你的订单。"],
    ["Review and place order", "核对并提交订单"],
    ["Review & Place Order", "核对并提交订单"],
    ["Please review your order details before placing your order.", "提交订单前，请核对订单信息。"],
    ["Review your payment details", "核对你的付款信息"],
    ["Items in Your Order", "订单中的商品"],
    ["Delivery Information", "配送信息"],
    ["Payment and Billing", "付款与账单"],
    ["Edit Payment Details", "编辑付款信息"],
    ["Edit Contact Information", "编辑联系信息"],
    ["Email Receipt", "电子邮件收据"],
    ["Receipt", "收据"],
    ["Receipt Email", "收据邮箱"],
    ["Send receipt to", "收据发送至"],
    ["Send order updates to", "订单更新发送至"],
    ["Order updates", "订单更新"],
    ["Notifications", "通知"],
    ["Notification Preferences", "通知偏好设置"],
    ["Keep me updated", "向我发送更新"],
    ["Send me text updates", "通过短信向我发送更新"],
    ["Place your order now", "立即提交订单"],
    ["Submit and Pay", "提交并付款"],
    ["Agree and Place Order", "同意并提交订单"],
    ["Terms of Sale", "销售条款"],
    ["Sales Terms and Conditions", "销售条款和条件"],
    ["By placing your order, you agree to the Terms and Conditions.", "提交订单即表示你同意条款和条件。"],
    ["Order Acknowledgment", "订单收悉通知"],
    ["Order Acknowledgement", "订单收悉通知"],
    ["Order Received - Apple", "订单已收到 - Apple"],
    ["Thank You - Apple", "谢谢 - Apple"],
    ["Thanks for shopping with Apple.", "感谢你在 Apple 选购。"],
    ["Thank you for shopping with Apple.", "感谢你在 Apple 选购。"],
    ["Thank you for shopping at Apple.", "感谢你在 Apple 选购。"],
    ["Thank you for your purchase.", "感谢你的购买。"],
    ["Your order has been received.", "我们已收到你的订单。"],
    ["We have received your order.", "我们已收到你的订单。"],
    ["Your order is on its way.", "你的订单正在配送途中。"],
    ["A confirmation email has been sent.", "确认邮件已发送。"],
    ["Check your email for your order confirmation.", "请查看电子邮箱中的订单确认邮件。"],
    ["Check your spam or junk folder.", "请检查垃圾邮件文件夹。"],
    ["Please keep your order number for your records.", "请保存订单编号以备查询。"],
    ["What happens next?", "接下来会怎样？"],
    ["What’s next?", "下一步是什么？"],
    ["What's next?", "下一步是什么？"],
    ["Order Placed — We’ve received your order and payment information and will start preparing your item shortly.", "订单已提交——我们已收到你的订单和付款信息，即将开始准备商品。"],
    ["Processing — As soon as the item is ready, we’ll send you an update and prepare the shipment.", "处理中——商品备妥后，我们会通知你并准备配送。"],
    ["Shipping to Store", "正在送往零售店"],
    ["Check in Today", "今日到店"],
    ["Ready for Pickup", "可取货"],
    ["Picked up", "已取货"],
    ["Pickup Canceled", "取货已取消"],
    ["Order Status & Details", "订单状态与详情"],
    ["View Order Details", "查看订单详情"],
    ["Your Orders", "你的订单"],
    ["Order Listing", "订单列表"],
    ["Online Order Status", "在线订单状态"],
    ["Web Order Number", "网上订单编号"],
    ["Confirmation Number", "确认编号"],
    ["Tracking Number", "物流跟踪号码"],
    ["Carrier", "承运商"],
    ["Shipment", "包裹"],
    ["Shipment Details", "包裹详情"],
    ["Shipment Status", "配送状态"],
    ["Delivery Status", "送达状态"],
    ["Delivered to", "已送达至"],
    ["Gift Card Status", "礼品卡状态"],
    ["Scheduled", "已预约"],
    ["Sent", "已发送"],
    ["Resend Gift Card", "重新发送礼品卡"],
    ["Resend Email", "重新发送邮件"],
    ["Recipient Details", "收件人信息"],
    ["Sent by email", "已通过电子邮件发送"],
    ["Invoice", "发票"],
    ["Invoice Number", "发票编号"],
    ["View Invoice", "查看发票"],
    ["Print Invoice", "打印发票"],
    ["Download Invoice", "下载发票"],
    ["Download Receipt", "下载收据"],
    ["View Receipt", "查看收据"],
    ["View or Print Invoice", "查看或打印发票"],
    ["Cancel Item", "取消商品"],
    ["Return Items", "退回商品"],
    ["Return or Replace Items", "退回或更换商品"],
    ["Request a Return", "申请退货"],
    ["Refund", "退款"],
    ["Refund Status", "退款状态"],
    ["Refund Pending", "退款处理中"],
    ["Refunded", "已退款"],
    ["Partially Refunded", "已部分退款"],
    ["Action Required", "需要采取操作"],
    ["Update Payment Method", "更新付款方式"],
    ["Update Payment Information", "更新付款信息"],
    ["Resolve Payment Issue", "解决付款问题"],
    ["On Hold", "暂缓处理"],
    ["Order on Hold", "订单暂缓处理"],
    ["Pending", "待处理"],
    ["Authorized", "已授权"],
    ["Declined", "已拒绝"],
    ["Error", "错误"],
    ["Authorization", "授权"],
  ];
  const MONTH_LABELS = new Map([["January", "1 月"], ["February", "2 月"], ["March", "3 月"], ["April", "4 月"], ["May", "5 月"], ["June", "6 月"], ["July", "7 月"], ["August", "8 月"], ["September", "9 月"], ["October", "10 月"], ["November", "11 月"], ["December", "12 月"]]);
  const EXACT = new Map(DICT.map(([en, zh]) => [normalize(en), zh]));

  const CASE_INSENSITIVE = new Map(DICT.map(([en, zh]) => [normalize(en).toLowerCase(), zh]));

  function normalize(text) {
    return text.replace(/[\u00a0\u202f]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function translateDeliveryDetails(text) {
    // 仅用于 Delivers ... 配送模板，不对一般姓名、地址或金额做片段替换。
    const fragments = [
      ['Express Delivery', '加急配送'], ['Standard Delivery', '标准配送'],
      ['Tomorrow', '明天'], ['Today', '今天'], ['FREE', '免费'],
      ['Monday', '周一'], ['Tuesday', '周二'], ['Wednesday', '周三'],
      ['Thursday', '周四'], ['Friday', '周五'], ['Saturday', '周六'], ['Sunday', '周日'],
      ['Mon', '周一'], ['Tue', '周二'], ['Wed', '周三'], ['Thu', '周四'],
      ['Fri', '周五'], ['Sat', '周六'], ['Sun', '周日'],
      ['January', '1 月'], ['February', '2 月'], ['March', '3 月'], ['April', '4 月'],
      ['June', '6 月'], ['July', '7 月'], ['August', '8 月'], ['September', '9 月'],
      ['October', '10 月'], ['November', '11 月'], ['December', '12 月'],
      ['business days', '个工作日'], ['business day', '个工作日'],
      ['days', '天'], ['day', '天'], ['weeks', '周'], ['week', '周'],
      ['In Stock', '现货'], ['Free', '免费'],
      ['Jan', '1 月'], ['Feb', '2 月'], ['Mar', '3 月'], ['Apr', '4 月'],
      ['May', '5 月'], ['Jun', '6 月'], ['Jul', '7 月'], ['Aug', '8 月'],
      ['Sep', '9 月'], ['Oct', '10 月'], ['Nov', '11 月'], ['Dec', '12 月'],
    ];
    for (const [en, zh] of fragments) text = text.replace(new RegExp('\\b' + en + '\\b', 'g'), zh);
    return text;
  }

  function knownLabel(text) {
    const key = normalize(text);
    return EXACT.get(key) || CASE_INSENSITIVE.get(key.toLowerCase()) || text;
  }

  // 只识别列出的付款/订单模板，动态金额、编号、邮箱和卡尾号原样保留。
  // 不使用一般英文单词替换，也不接触 input.value。
  function translatePaymentOrderTemplate(text) {
    const label = text.match(/^(Amount Due(?: Today)?|Amount Paid|Amount to Pay|Payment Total|Total Due Today|Remaining Amount|Remaining Balance|Available Balance|Gift Card Balance|Payment Method|Payment Status|Paid with|Paid by|Charged to|Order Status|Order Date|Order Number|Web Order Number|Confirmation Number|Invoice Number|Tracking Number|Receipt Email|Send receipt to|Send order updates to|Gift Card Status|Refund Status):\s+(.+)$/i);
    if (label) {
      const value = /^(Payment Method|Payment Status|Paid with|Paid by|Charged to|Order Status|Gift Card Status|Refund Status)$/i.test(label[1])
        ? (translatePaymentOrderTemplate(label[2]) || knownLabel(label[2]))
        : /^Order Date$/i.test(label[1]) ? translateDeliveryDetails(label[2]) : label[2];
      return knownLabel(label[1]) + '：' + value;
    }
    const rules = [
      [/^(Visa|Mastercard|American Express|Discover|Credit Card|Debit Card|Card) (?:ending in|ending with) ([•*xX\d -]*\d{4})\.?$/i,
        (_, brand, ending) => knownLabel(brand) + ' 尾号 ' + ending],
      [/^(?:Ending in|Ending with) ([•*xX\d -]*\d{4})\.?$/i, '尾号 $1'],
      [/^Expires(?: on)? (\d{1,2}\s*\/\s*\d{2,4})\.?$/i, '有效期 $1'],
      [/^Your (?:web )?order number is[: ]+([A-Z0-9-]+)\.?$/i, '你的订单编号为 $1。'],
      [/^(Order Number|Web Order Number|Confirmation Number|Invoice Number|Tracking Number)\s+#?([A-Z0-9-]+)$/i,
        (_, label, number) => knownLabel(label) + '：' + number],
      [/^We(?:[’']ll| will) (?:send|email) (?:you )?(?:an? )?(?:order )?confirmation(?: email)? to (\S+@\S+?)\.?$/i,
        '我们将向 $1 发送订单确认邮件。'],
      [/^We(?:[’']ve| have) (?:sent|emailed) (?:you )?(?:an? )?(?:order )?confirmation(?: email)? to (\S+@\S+?)\.?$/i,
        '我们已向 $1 发送订单确认邮件。'],
      [/^(?:An? )?(?:order )?confirmation(?: email)? (?:has been |was )sent to (\S+@\S+?)\.?$/i,
        '订单确认邮件已发送至 $1。'],
      [/^Your receipt (?:has been |was )sent to (\S+@\S+?)\.?$/i, '你的收据已发送至 $1。'],
      [/^We(?:[’']ll| will) (?:send|email) (?:your |a )?receipt to (\S+@\S+?)\.?$/i, '我们将向 $1 发送收据。'],
      [/^Your gift card (?:has been |was )sent to (\S+@\S+?)\.?$/i, '你的礼品卡已发送至 $1。'],
      [/^Your gift card will be sent to (\S+@\S+?)\.?$/i, '你的礼品卡将发送至 $1。'],
      [/^Order placed on (.+)$/i, (_, date) => '下单日期：' + translateDeliveryDetails(date)],
      [/^Estimated delivery: (.+)$/i, (_, date) => '预计送达：' + translateDeliveryDetails(date)],
      [/^Estimated arrival: (.+)$/i, (_, date) => '预计到达：' + translateDeliveryDetails(date)],
    ];
    for (const [pattern, replacement] of rules) {
      if (pattern.test(text)) return text.replace(pattern, replacement);
    }
    return null;
  }

  function translate(text) {
    const key = normalize(text);
    if (!key) return text;
    let result = EXACT.get(key) || CASE_INSENSITIVE.get(key.toLowerCase()) || translatePaymentOrderTemplate(key);
    if (!result) {
      // 同一标签可能以冒号、句点或问号结尾，仅在已知词条上补齐标点。
      const punctuation = key.match(/^(.*?)([:.?])$/);
      if (punctuation) {
        const base = normalize(punctuation[1]);
        const translated = EXACT.get(base) || CASE_INSENSITIVE.get(base.toLowerCase());
        if (translated) result = translated.replace(/[：。？]$/, '') + ({ ':': '：', '.': '。', '?': '？' })[punctuation[2]];
      }
      const optional = key.match(/^(.*?)\s*\((Optional|Required)\)$/i);
      if (optional) {
        const base = EXACT.get(optional[1]) || CASE_INSENSITIVE.get(optional[1].toLowerCase());
        if (base) result = base + (optional[2].toLowerCase() === 'optional' ? '（选填）' : '（必填）');
      }
      // 仅处理已知模板，金额和号码原样保留。
      const rules = [
        [/^None Order by (.+?) Delivers to: (.+?) Order now\. Pick up in-store: Apple Store Pickup is currently unavailable$/i,
          (_, cutoff, dates) => '无。请于 ' + cutoff + ' 前订购。配送时间：' + translateDeliveryDetails(dates) + '。立即订购。到店取货：目前不支持 Apple Store 到店取货'],
        [/^Order by (.+?) Delivers to: (.+?) Order now\. Pick up in-store: Apple Store Pickup is currently unavailable$/i,
          (_, cutoff, dates) => '请于 ' + cutoff + ' 前订购。配送时间：' + translateDeliveryDetails(dates) + '。立即订购。到店取货：目前不支持 Apple Store 到店取货'],
        [/^Order by (.+?)\.?$/i, (_, cutoff) => '请于 ' + cutoff + ' 前订购'],
        [/^Shopping Bag with item count\s*:\s*(\d+)$/i, '购物袋，$1 件商品'],
        [/^(\d+) Edit Zip code$/i, '$1，编辑邮政编码'],
        [/^or call (.+?)\s*\.$/i, '或致电 $1。'],
        [/^Select your delivery method: (.+)$/i, (_, product) => '选择配送方式：' + knownLabel(product)],
        [/^Add to Bag \((.+)\)$/i, '加入购物袋（$1）'],
        [/^Edit gift message on card for (.+)$/i, (_, product) => '编辑礼品卡祝福语：' + knownLabel(product)],
        [/^(.*) removed from your bag\. Any associated offers have also been removed\.$/i,
          (_, product) => knownLabel(product) + '已从购物袋移除，相关优惠也已移除。'],
        [/^(.+?) [—–-] Secure Checkout(?: - Apple)?$/i,
          (_, step) => knownLabel(step) + ' — 安全结账'],
        [/^Your shipping total is (\$[\d,.]+)\.?$/i, '你的配送费用合计为 $1'],
        [/^Show Order Summary: (\$[\d,.]+)$/i, '显示订单摘要：$1'],
        [/^Hide Order Summary: (\$[\d,.]+)$/i, '隐藏订单摘要：$1'],
        [/^Your bag total is (\$[\d,.]+)\.$/i, '你的购物袋总计为 $1。'],
        [/^Buy (\$[\d,.]+) Apple Gift Cards? - Apple$/i, '购买 $1 Apple 礼品卡 - Apple'],
        [/^(\d+) items?$/i, '$1 件商品'],
        [/^Quantity for (.+)$/i, (_, product) => '商品数量：' + knownLabel(product)],
        [/^Remove (Apple Gift Card.*)$/i, (_, product) => '移除 ' + knownLabel(product)],
        [/^Save for later (Apple Gift Card.*)$/i, (_, product) => '保存 ' + knownLabel(product) + ' 以便稍后查看'],
        [/^Order (?:Number|number): (.+)$/, '订单编号：$1'],
        [/^Order Total: (\$[\d,.]+)$/i, '订单总计：$1'],
        [/^Total: (\$[\d,.]+)$/i, '合计：$1'],
        [/^Subtotal: (\$[\d,.]+)$/i, '小计：$1'],
        [/^Estimated Tax: (\$[\d,.]+)$/i, '预估税费：$1'],
        [/^Delivery: (.+)$/i, '配送：$1'],
        [/^Shipping: (.+)$/i, '配送：$1'],
        [/^Arrives (.+)$/i, (_, details) => '预计送达：' + translateDeliveryDetails(details)],
        [/^Delivers (.+)$/i, (_, details) => '预计送达：' + translateDeliveryDetails(details)],
        [/^Ships: (.+)$/i, (_, details) => '发货时间：' + translateDeliveryDetails(details)],
        [/^Ships in (.+)$/i, (_, details) => '将在 ' + translateDeliveryDetails(details) + '内发货'],
        [/^Delivery to (.+)$/i, '配送至 $1'],
        [/^Shipping to (.+)$/i, '配送至 $1'],
        [/^Email to: (.+)$/i, '发送邮件至：$1'],
        [/^Sent to: (.+)$/i, '发送至：$1'],
        [/^Please enter (?:your |a valid )?(first name|last name|phone number|email address|street address|city|ZIP code|postal code|card number|security code)\.$/i,
          (_, field) => '请输入有效的' + (CASE_INSENSITIVE.get(field.toLowerCase()) || field) + '。'],
        [/^Copyright © (\d{4}) Apple Inc\. All rights reserved\.$/, '版权所有 © $1 Apple Inc. 保留所有权利。'],
        [/^\. Issued by Apple Value Services, LLC \(AVS\)\. © (\d{4}) Apple Inc\. All rights reserved\.$/, '。由 Apple Value Services, LLC（AVS）发行。© $1 Apple Inc. 保留所有权利。'],
        [/^Need some help\? Call (.+?)\s*\.$/, '需要帮助？请致电 $1。'],
        [/^near you\. Or call (.+?)\s*\.$/, '。或致电 $1。'],
        [/^(\d+) characters remaining$/, '还可输入 $1 个字符'],
        [/^Enter an amount between (\$[\d,]+(?:\.\d+)?) and (\$[\d,]+(?:\.\d+)?)\.$/, '请输入 $1 至 $2 之间的金额。'],
      ];
      for (const [pattern, replacement] of rules) {
        if (!result && pattern.test(key)) { result = key.replace(pattern, replacement); break; }
      }
      // 无障碍标签常附有新窗口提示和图标。
      const windowHint = key.match(/^(.*?)\s*\(opens in a new window\)\s*([\uE000-\uF8FF]*)$/i);
      if (!result && windowHint) {
        const base = normalize(windowHint[1]);
        const translated = EXACT.get(base) || CASE_INSENSITIVE.get(base.toLowerCase());
        if (translated) result = translated + '（在新窗口中打开）' + windowHint[2];
      }
      const accessibilityHint = key.match(/^(.*?)\s*([\uE000-\uF8FF]*)\s*Opens in a new window\.$/i);
      if (!result && accessibilityHint) {
        const translated = knownLabel(accessibilityHint[1]);
        if (translated !== accessibilityHint[1]) result = translated + accessibilityHint[2] + '（在新窗口中打开）';
      }
      const suffix = ' (Opens in a new window)';
      if (!result && key.endsWith(suffix)) {
        const base = EXACT.get(key.slice(0, -suffix.length));
        if (base) result = `${base}（在新窗口中打开）`;
      }
    }
    if (!result) {
      const icon = key.match(/^(.*?)([\uE000-\uF8FF]+)$/);
      if (icon) {
        const base = normalize(icon[1]);
        const translated = EXACT.get(base) || CASE_INSENSITIVE.get(base.toLowerCase());
        if (translated) result = translated + ' ' + icon[2];
      }
    }
    if (!result) return text;
    return text.match(/^\s*/)[0] + result + text.match(/\s*$/)[0];
  }

  const ATTRS = ['placeholder', 'title', 'aria-label', 'aria-description', 'aria-valuetext', 'alt'];
  const SKIP = 'script, style, noscript, template, input, textarea, option:not([value]), code, pre, [contenteditable]:not([contenteditable="false"]), [data-apple-giftcard-zh-ui]';
  const SKIP_ATTRS = 'script, style, noscript, template, code, pre, [contenteditable]:not([contenteditable="false"]), [data-apple-giftcard-zh-ui]';
  const originals = new Map();
  let enabled = true;
  let toggle = null;
  let booted = false;

  function write(node, name, current) {
    if (!current) return;
    // 月份仅在显式选项和配送日期模板中转换，避免将收件人 May / June 等姓名误译。
    const month = name === '#text' && node.parentElement && node.parentElement.closest('option[value]') && MONTH_LABELS.get(normalize(current));
    const next = month ? current.match(/^\s*/)[0] + month + current.match(/\s*$/)[0] : translate(current);
    if (next === current) return;
    let entries = originals.get(node);
    if (!entries) {
      entries = new Map();
      originals.set(node, entries);
    }
    const previous = entries.get(name);
    entries.set(name, {
      original: previous && previous.output === current ? previous.original : current,
      output: next,
    });
    if (name === '#text') node.nodeValue = next;
    else node.setAttribute(name, next);
  }

  function translateTextNode(node) {
    if (!enabled || !node || node.nodeType !== 3) return;
    const parent = node.parentElement;
    if (!parent || parent.closest(SKIP)) return;
    write(node, '#text', node.nodeValue);
  }

  // Apple Pay 网页按钮可能由 Safari 绘制，文本节点遍历无法修改它。
  // 使用 Apple 官方提供的 lang / locale，不替换按钮，不改变点击事件。
  function setPresentation(element, name, output) {
    const current = element.getAttribute(name);
    if (current === output) return;
    let entries = originals.get(element);
    if (!entries) { entries = new Map(); originals.set(element, entries); }
    const previous = entries.get(name);
    entries.set(name, {
      original: previous && previous.output === current ? previous.original : current,
      output,
    });
    element.setAttribute(name, output);
  }

  function localizeApplePayButton(element) {
    if (element.localName === 'apple-pay-button') {
      setPresentation(element, 'locale', 'zh-CN');
      return;
    }
    if (!element.matches('button, [role="button"], input[type="button"], input[type="submit"]')) return;
    const hint = [element.id, element.getAttribute('class'), element.getAttribute('aria-label'), element.textContent].join(' ');
    if (/apple[\s_-]?pay|apwcheckout|\s*pay/i.test(hint)) {
      setPresentation(element, 'lang', 'zh-CN');
    }
  }

  function translateElementAttrs(element) {
    if (!enabled || !element || element.nodeType !== 1) return;
    if (element.closest(SKIP_ATTRS)) return;
    localizeApplePayButton(element);
    for (const attr of ATTRS) {
      if (element.hasAttribute(attr)) write(element, attr, element.getAttribute(attr));
    }
  }

  function walk(root) {
    if (!enabled || !root) return;
    if (root.nodeType === 3) {
      translateTextNode(root);
      return;
    }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1) {
      translateElementAttrs(root);
      if (root.closest(SKIP)) return;
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode(node) {
        if (node.nodeType === 1 && node.matches(SKIP)) {
          // 输入框仅翻译 placeholder 等展示属性，保留 value 和输入内容。
          translateElementAttrs(node);
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === 3) translateTextNode(node);
      else translateElementAttrs(node);
    }
  }

  function updateToggle() {
    toggle.textContent = enabled ? '查看英文' : '切换中文';
    toggle.setAttribute('aria-label', enabled ? '切换为英文原文' : '切换为简体中文');
  }

  function toggleLanguage() {
    enabled = !enabled;
    if (enabled) walk(document.documentElement || document);
    else {
      for (const [node, entries] of originals) {
        if (!node.isConnected) continue;
        for (const [name, entry] of entries) {
          const current = name === '#text' ? node.nodeValue : node.getAttribute(name);
          if (current !== entry.output) continue;
          if (name === '#text') node.nodeValue = entry.original;
          else if (entry.original === null) node.removeAttribute(name);
          else node.setAttribute(name, entry.original);
        }
      }
      originals.clear();
    }
    updateToggle();
  }

  function ensureToggle() {
    // 登录框等内嵌页面也翻译，但只在顶层页面显示切换按钮。
    if (window.top !== window.self || !document.body || (toggle && toggle.isConnected)) return;
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.setAttribute('data-apple-giftcard-zh-ui', '');
      toggle.style.cssText = 'position:fixed;right:16px;bottom:calc(20px + env(safe-area-inset-bottom, 0px));z-index:2147483647;padding:10px 15px;border:1px solid #86868b;border-radius:24px;background:#fff;color:#1d1d1f;font:14px/1.4 system-ui,sans-serif;box-shadow:0 2px 12px #0002;cursor:pointer;';
      toggle.addEventListener('click', toggleLanguage);
      updateToggle();
    }
    document.body.appendChild(toggle);
  }

  function pruneOriginals() {
    for (const node of originals.keys()) {
      if (!node.isConnected) originals.delete(node);
    }
  }

  function startObserver() {
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') translateTextNode(mutation.target);
        else if (mutation.type === 'attributes') translateElementAttrs(mutation.target);
        else {
          for (const node of mutation.addedNodes) walk(node);
        }
      }
      ensureToggle();
      // 移除已经离开页面的节点，避免长期保留其引用。
      if (mutations.some(m => m.type === 'childList' && m.removedNodes.length)) pruneOriginals();
    });
    observer.observe(document.documentElement || document, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ATTRS.concat(['lang', 'locale', 'class']),
    });
  }

  function boot() {
    if (booted) return;
    booted = true;
    walk(document.documentElement || document);
    startObserver();
    ensureToggle();
    // 参考脚本的短时补扫，覆盖首屏连续重绘；之后只靠观察器更新。
    let ticks = 0;
    const timer = setInterval(() => {
      walk(document.documentElement || document);
      ensureToggle();
      pruneOriginals();
      if (++ticks >= 20) clearInterval(timer);
    }, 150);
  }

  if (document.documentElement) boot();
  else document.addEventListener('DOMContentLoaded', boot, { once: true });
  window.addEventListener('load', () => {
    boot();
    walk(document.documentElement || document);
    ensureToggle();
  });
})();
