// 台湾 VPS 面板 - Surge 面板版(极简重建)
// 只要 $httpClient + $done, 不用 async/Promise/新接口, 不带城市翻译表.
// 显示: 当前出口 IP、出口地点、ISP、延迟、套餐与到期、节点端口. 点面板即刷新.
var _start = Date.now();
$httpClient.get(
  { url: 'https://4.ipwho.de/json', policy: '海外节点', timeout: 5 },
  function(err, resp, data) {
    if (err) {
      $done({ title: '台湾 VPS · 查询失败', content: '点一下重试', icon: 'exclamationmark.triangle', 'icon-color': '#FF9500' });
      return;
    }
    try {
      var d = JSON.parse(data);
      var latency = Date.now() - _start;
      var loc = (d.country_code || '') + ' ' + (d.city_name || '');
      var isp = d.asn ? ('AS' + d.asn + ' ' + (d.as_desc || '')) : '未知';
      $done({
        title: '台湾 VPS · ' + d.ip,
        content: '出口: ' + loc + '  延迟: ' + latency + 'ms\nISP: ' + isp + '\n套餐: NAT2 $1.28/月  1000G  到期 2026-12-07\n节点: VLESS 50139 / Trojan 37160·19731',
        icon: 'server.rack',
        'icon-color': '#007AFF'
      });
    } catch (e) {
      $done({ title: '台湾 VPS · 查询失败', content: '点一下重试', icon: 'exclamationmark.triangle', 'icon-color': '#FF9500' });
    }
  }
);
