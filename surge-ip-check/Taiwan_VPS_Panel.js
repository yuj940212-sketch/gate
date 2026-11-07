// Taiwan VPS Panel - Surge 面板版
// 在 Surge 首页(仪表盘)直接显示台湾 VPS 的信息, 点一下面板就能刷新, 不用打开浏览器.
// 显示: 当前出口 IP、出口地点、ISP、到 ipwho.de 的延迟(约等于节点延迟)、
// VPS 套餐与到期时间、节点端口. 面板只查一次 IP, 不做测速, 刷新一次只花几 KB.
// 套餐/到期/余额是写死的静态信息(截至 2026-11-07 晚: 余额 $0.72, 已用流量约 3GB),
// 服务器实时的 CPU/内存/流量/运行时间, Surge 面板本身拿不到, 要在 VPS 上另装一个
// 状态接口才能显示, 想要的话去 VPS 旁聊说一声, 我在那边给你装.

const codeMap = { HK: '🇭🇰 香港', TW: '🇼🇸 台湾', SG: '🇸🇬 新加坡', JP: '🇯🇵 日本', KR: '🇰🇷 韩国', US: '🇺🇸 美国', DE: '🇩🇪 德国', GB: '🇬🇧 英国', NL: '🇳🇱 荷兰', FR: '🇫🇷 法国', CA: '🇨🇦 加拿大', AU: '🇦🇺 澳大利亚', TR: '🇹🇷 土耳其', MO: '🇲🇴 澳门', RU: '🇷🇺 俄罗斯' };

const cityMap = {

  // 中国香港
  'aberdeen': '香港仔',
  'causeway bay': '铜锣湾',
  'central': '中环',
  'chai wan': '柴湾',
  'cheung sha wan': '长沙湾',
  'hong kong': '香港',
  'kowloon': '九龙',
  'kwai chung': '葵涌',
  'kwun tong': '观塘',
  'lai chi kok': '荔枝角',
  'sha tin': '沙田',
  'shatin': '沙田',
  'tai po': '大埔',
  'tseung kwan o': '将军澳',
  'tsing yi': '青衣',
  'tsuen wan': '荃湾',
  'tuen mun': '屯门',
  'wan chai': '湾仔',
  'yuen long': '元朗',

  // 中国台湾
  'banqiao': '板桥',
  'changhua': '彰化',
  'hsinchu': '新竹',
  'kaohsiung': '高雄',
  'new taipei': '新北',
  'taichung': '台中',
  'tainan': '台南',
  'taipei': '台北',
  'taoyuan': '桃园',
  'xizhi': '汐止',
  'zhubei': '竹北',

  // 新加坡
  'singapore': '新加坡',
  'loyang': '罗央',

  // 日本
  'akita': '秋田',
  'chiba': '千叶',
  'fukuoka': '福冈',
  'inzai': '印西',
  'ishikari': '石狩',
  'kanagawa': '神奈川',
  'kawasaki': '川崎',
  'kobe': '神户',
  'koto': '江东区',
  'kyoto': '京都',
  'nagoya': '名古屋',
  'osaka': '大阪',
  'saitama': '埼玉',
  'sapporo': '札幌',
  'sendai': '仙台',
  'shibuya': '涩谷',
  'shinagawa': '品川',
  'shinjuku': '新宿',
  'tokyo': '东京',
  'toyosu': '丰洲',
  'yokohama': '横滨',

  // 韩国
  'anyang': '安养',
  'busan': '釜山',
  'chuncheon': '春川',
  'daegu': '大邱',
  'daejeon': '大田',
  'gangnam gu': '江南区',
  'gangseo gu': '江西区',
  'geumcheon gu': '衿川区',
  'guro gu': '九老区',
  'gwangju': '光州',
  'incheon': '仁川',
  'jeju': '济州',
  'mapo gu': '麻浦区',
  'seocho gu': '瑞草区',
  'seongdong gu': '城东区',
  'seongnam': '城南',
  'seoul': '首尔',
  'songpa gu': '松坡区',
  'suwon': '水原',
  'ulsan': '蔚山',
  'yeongdeungpo gu': '永登浦区',
  'yongsan gu': '龙山区',

  // 美国
  'ashburn': '阿什本',
  'atlanta': '亚特兰大',
  'boston': '波士顿',
  'buffalo': '布法罗',
  'carteret': '卡特雷特',
  'cary': '凯瑞',
  'charlotte': '夏洛特',
  'chicago': '芝加哥',
  'cleveland': '克利夫兰',
  'clifton': '克利夫顿',
  'council bluffs': '康索尔布拉夫斯',
  'dallas': '达拉斯',
  'denver': '丹佛',
  'detroit': '底特律',
  'durham': '达勒姆',
  'fort worth': '沃斯堡',
  'fremont': '弗里蒙特',
  'herndon': '赫恩登',
  'hillsboro': '希尔斯伯勒',
  'houston': '休斯顿',
  'jacksonville': '杰克逊维尔',
  'kansas city': '堪萨斯城',
  'las vegas': '拉斯维加斯',
  'los angeles': '洛杉矶',
  'mclean': '麦克林',
  'miami': '迈阿密',
  'minneapolis': '明尼阿波利斯',
  'new york': '纽约',
  'newark': '纽瓦克',
  'north bergen': '北卑尔根',
  'norwalk': '诺沃克',
  'ogden': '奥格登',
  'orlando': '奥兰多',
  'philadelphia': '费城',
  'phoenix': '凤凰城',
  'piscataway': '皮斯卡塔韦',
  'portland': '波特兰',
  'prineville': '普林维尔',
  'provo': '普罗沃',
  'quincy': '昆西',
  'raleigh': '罗利',
  'reston': '雷斯顿',
  'salt lake city': '盐湖城',
  'san francisco': '旧金山',
  'san jose': '圣何塞',
  'sandy': '桑迪',
  'santa clara': '圣克拉拉',
  'santa monica': '圣塔莫尼卡',
  'seattle': '西雅图',
  'secaucus': '塞考克斯',
  'somerset': '萨默塞特',
  'sunnyvale': '桑尼维尔',
  'tampa': '坦帕',
  'the dalles': '达尔斯',

  // 德国
  'berlin': '柏林',
  'dusseldorf': '杜塞尔多夫',
  'falkenstein': '法尔肯施泰因',
  'frankfurt': '法兰克福',
  'hamburg': '汉堡',
  'munich': '慕尼黑',
  'nuremberg': '纽伦堡',
  'stuttgart': '斯图加特',

  // 英国
  'canary wharf': '金丝雀码头',
  'london': '伦敦',
  'manchester': '曼彻斯特',
  'reading': '雷丁',
  'slough': '斯劳',

  // 荷兰
  'amsterdam': '阿姆斯特丹',
  'eindhoven': '埃因霍温',
  'haarlem': '哈勒姆',
  'rotterdam': '鹿特丹',
  'schiphol': '史基浦',
  'utrecht': '乌德勒支',

  // 法国
  'lyon': '里昂',
  'marseille': '马赛',
  'paris': '巴黎',
  'strasbourg': '斯特拉斯堡',

  // 加拿大
  'beauharnois': '博阿努瓦',
  'montreal': '蒙特利尔',
  'toronto': '多伦多',
  'vancouver': '温哥华',

  // 澳大利亚
  'brisbane': '布里斯班',
  'melbourne': '墨尔本',
  'perth': '珀斯',
  'sydney': '悉尼',

  // 土耳其
  'ankara': '安卡拉',
  'istanbul': '伊斯坦布尔',
  'izmir': '伊兹密尔',

  // 中国澳门
  'macao': '澳门',
  'macau': '澳门',

  // 俄罗斯
  'moscow': '莫斯科',
  'saint petersburg': '圣彼得堡',
  'st petersburg': '圣彼得堡'
};

const IPPURE_RESIDENTIAL_KEYS = ['isResidential', 'is_residential', 'residential'];
const IPPURE_RISK_KEYS = ['fraudScore', 'riskScore', 'risk_score', 'score'];

let CITY_REGEX = null;
let CITY_REGEX_READY = false;

function now() {
  return typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? performance.now()
    : Date.now();
}

function isEnvOn(v) {
  return String(v || '').trim() === '开启';
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getCityRegex() {
  if (CITY_REGEX_READY) return CITY_REGEX;

  const keys = Object.keys(cityMap)
    .sort((a, b) => b.length - a.length);

  CITY_REGEX = keys.length
    ? new RegExp('\\b(' + keys.map(escapeRegExp).join('|') + ')\\b')
    : null;

  CITY_REGEX_READY = true;
  return CITY_REGEX;
}

function normalizeCityKey(text) {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f.,]/g, '')
    .replace(/[-_\s]+/g, ' ');
}

function translateCity(text) {
  if (typeof text !== 'string') return '';

  const raw = text.trim();
  if (!raw) return '';

  const lower = raw.toLowerCase();

  let translated = cityMap[lower];
  if (translated) return translated;

  const key = normalizeCityKey(raw);
  if (!key) return raw;

  if (key !== lower) {
    translated = cityMap[key];
    if (translated) return translated;
  }

  const regex = getCityRegex();
  if (regex) {
    const match = regex.exec(key);
    if (match) return cityMap[match[1]];
  }

  return raw;
}

function parseBooleanLike(v) {
  if (typeof v === 'boolean') return v;

  if (typeof v === 'number') {
    if (v === 1) return true;
    if (v === 0) return false;
    return undefined;
  }

  if (typeof v === 'string') {
    switch (v.trim().toLowerCase()) {
      case 'true':
      case '1':
      case 'yes':
      case 'y':
        return true;

      case 'false':
      case '0':
      case 'no':
      case 'n':
        return false;

      default:
        return undefined;
    }
  }

  return undefined;
}

function pickFirstValidField(obj, keys) {
  if (!obj || typeof obj !== 'object') return undefined;

  for (let i = 0; i < keys.length; i++) {
    const value = obj[keys[i]];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }

  return undefined;
}

function parsePositiveFloat(v, fallback) {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}


function normalizePlaceNameForCompare(text) {
  return String(text || '')
    .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '')
    .replace(/\s+/g, '')
    .replace(/[·・.。,_-]/g, '')
    .trim()
    .toLowerCase();
}

function getCountryName(ipInfo) {
  const countryCode = String(ipInfo?.country_code || '').toUpperCase();

  return (
    codeMap[countryCode] ||
    countryCode ||
    '未知'
  ).trim();
}

function formatLocationName(ipInfo) {
  const countryName = getCountryName(ipInfo);

  const cityName = typeof ipInfo.city_name_zh === 'string'
    ? ipInfo.city_name_zh.trim()
    : '';

  if (!cityName) {
    return countryName;
  }

  const normalizedCountry = normalizePlaceNameForCompare(countryName);
  const normalizedCity = normalizePlaceNameForCompare(cityName);

  if (
    normalizedCountry &&
    normalizedCity &&
    normalizedCountry.endsWith(normalizedCity)
  ) {
    return countryName;
  }

  return `${countryName}·${cityName}`;
}

// IP Check Panel - Surge 面板版
// 用法: 装上模块后, Surge 首页(仪表盘)就会出现一块 IP 面板, 显示当前出口 IP、
// 出口地点、ISP, 点一下面板就能刷新, 不用打开浏览器、不用输网址.
// 面板只查 IP 信息, 不做测速、不查纯净度, 刷新一次只花几 KB, 不费流量.
// 测速和纯净度还是去 http://ipwho.de/json 那页看(模块的 http-response 脚本还在).

function httpGetJson(url, timeoutMs) {
  var timeout = timeoutMs || 5000;
  if (typeof $task !== 'undefined' && $task && typeof $task.fetch === 'function') {
    var timer = null;
    var timeoutPromise = new Promise(function(_, reject) {
      timer = setTimeout(function() { reject(new Error('Timeout')); }, timeout);
    });
    return Promise.race([$task.fetch(url, { method: 'GET', headers: { 'User-Agent': 'Surge' }, policy: 'PROXY' }), timeoutPromise])
      .then(function(res) { clearTimeout(timer); return res.json(); })
      .catch(function(e) { clearTimeout(timer); throw e; });
  }
  return new Promise(function(resolve, reject) {
    $httpClient.get({ url: url, headers: { 'User-Agent': 'Surge' }, policy: 'PROXY', timeout: Math.max(1, Math.ceil(timeout / 1000)) }, function(err, resp, data) {
      if (err) return reject(err);
      try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
    });
  });
}

(async function main() {
  try {
    var start = Date.now();
    var data = await httpGetJson('https://4.ipwho.de/json', 5000);
    var latency = Date.now() - start;
    if (!data || typeof data.ip !== 'string' || !data.ip) throw new Error('no ip');
    if (typeof data.city_name === 'string' && data.city_name) data.city_name_zh = translateCity(data.city_name);
    var loc = formatLocationName(data);
    var isp = data.asn ? ('AS' + data.asn + ' ' + (data.as_desc || '')).trim() : '未知';
    $done({
      title: '台湾 VPS · ' + data.ip,
      content: '出口: ' + loc + '  延迟: ' + latency + 'ms\nISP: ' + isp + '\n套餐: NAT2 $1.28/月  1000G  到期 2026-12-07\n节点: VLESS 50139 / Trojan 37160·19731',
      icon: 'server.rack',
      'icon-color': '#007AFF'
    });
  } catch (e) {
    $done({
      title: '台湾 VPS · 查询失败',
      content: '点一下重试',
      icon: 'exclamationmark.triangle',
      'icon-color': '#FF9500'
    });
  }
})();
