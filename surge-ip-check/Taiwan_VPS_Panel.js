// 台湾 VPS 面板 - Surge 面板版(兜底版)
// 不管请求成不成, 只要脚本跑起来就一定显示内容:
// 套餐与节点是写死的静态信息一定能显示; 出口 IP 能查到就一起显示, 查不到就显示"IP 未查到".
var _start = Date.now();
var STATIC = '套餐: NAT2 $1.28/月  1000G  到期 2026-12-07\n节点: VLESS 50139 / Trojan 37160·19731';
try {
  $httpClient.get({ url: 'https://4.ipwho.de/json', policy: '海外节点', timeout: 3 }, function(err, resp, data) {
    try {
      if (err) throw new Error('req failed');
      var d = JSON.parse(data);
      var latency = Date.now() - _start;
      var loc = (d.country_code || '') + ' ' + (d.city_name || '');
      var isp = d.asn ? ('AS' + d.asn + ' ' + (d.as_desc || '')) : '未知';
      $done({ title: '台湾 VPS · ' + d.ip, content: '出口: ' + loc + '  延迟: ' + latency + 'ms\nISP: ' + isp + '\n' + STATIC, icon: 'server.rack', 'icon-color': '#007AFF' });
    } catch (e) {
      $done({ title: '台湾 VPS · NAT2', content: '出口 IP: 未查到, 点一下重试\n' + STATIC, icon: 'server.rack', 'icon-color': '#007AFF' });
    }
  });
} catch (e) {
  $done({ title: '台湾 VPS · NAT2', content: STATIC, icon: 'server.rack', 'icon-color': '#007AFF' });
}
