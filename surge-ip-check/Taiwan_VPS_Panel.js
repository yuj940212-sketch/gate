// 台湾 VPS 面板 - 实时流量版
// 读 VPS 上的流量接口 http://tw2.fuckip.me:8899/status (DIRECT 直连, 不走代理),
// 显示本月已用/还剩多少流量; 读不到就显示静态信息兜底, 绝不留白.
// 注意: 接口的 used_gb 只包含 vnstat 安装后(2026-11-07 23:55 起)的流量,
// 安装前本周期已用了约 4.2GB, 显示时必须加上.
var PRE_GB = 4.2;
var TOTAL_GB = 1000;
var STATIC = '套餐: NAT2 $1.28/月  1000G\n到期: 2026-12-07\n入口: tw2.fuckip.me\n节点: VLESS 50139 / Trojan 37160·19731';
function round1(x) { return Math.round(x * 10) / 10; }
try {
  $httpClient.get({ url: 'http://tw2.fuckip.me:8899/status', headers: { Accept: 'application/json', 'User-Agent': 'Surge Taiwan VPS Panel' }, timeout: 5, policy: 'DIRECT', 'auto-cookie': false }, function(err, resp, data) {
    try {
      if (err) throw new Error('req failed');
      var d = JSON.parse(data);
      var used = round1((Number(d.used_gb) || 0) + PRE_GB);
      var remaining = round1(TOTAL_GB - used);
      $done({ title: '台湾 VPS', content: '本月已用: ' + used + ' GB\n还剩: ' + remaining + ' GB\n' + STATIC, style: 'good' });
    } catch (e) {
      $done({ title: '台湾 VPS', content: '流量: 未查到, 点一下重试\n' + STATIC, style: 'info' });
    }
  });
} catch (e) {
  $done({ title: '台湾 VPS', content: STATIC, style: 'info' });
}
