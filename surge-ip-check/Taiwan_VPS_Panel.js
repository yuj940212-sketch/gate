// 台湾 VPS 面板 - Surge 面板版(按 vfelix7 IP 纯净度模块的写法)
// 面板脚本以 type=generic 注册在 [Script], [Panel] 用 script-name 引用, 并带默认标题.
// 策略组从模块参数 Proxy 取(默认 海外节点), 用 $httpClient.get + $done({title, content, style}).
// 套餐与节点是写死的静态信息, 查不到出口 IP 时也一定显示.
var args = (typeof $argument === 'string' ? $argument : '');
var policy = '海外节点';
if (args.indexOf('Proxy=') === 0) policy = args.slice(6).split('&')[0].trim() || '海外节点';
var STATIC = '套餐: NAT2 $1.28/月  1000G  到期 2026-12-07\n节点: VLESS 50139 / Trojan 37160·19731';
var _start = Date.now();
try {
  $httpClient.get({ url: 'https://4.ipwho.de/json', headers: { Accept: 'application/json', 'User-Agent': 'Surge Taiwan VPS Panel' }, timeout: 8, policy: policy, 'auto-cookie': false }, function(err, resp, data) {
    try {
      if (err) throw new Error('req failed');
      var d = JSON.parse(data);
      var latency = Date.now() - _start;
      var loc = (d.country_code || '') + ' ' + (d.city_name || '');
      var isp = d.asn ? ('AS' + d.asn + ' ' + (d.as_desc || '')) : '未知';
      $done({ title: '台湾 VPS · ' + d.ip, content: '出口: ' + loc + '  延迟: ' + latency + 'ms\nISP: ' + isp + '\n' + STATIC, style: 'good' });
    } catch (e) {
      $done({ title: '台湾 VPS · NAT2', content: '出口 IP: 未查到, 点一下重试\n' + STATIC, style: 'info' });
    }
  });
} catch (e) {
  $done({ title: '台湾 VPS · NAT2', content: STATIC, style: 'info' });
}
