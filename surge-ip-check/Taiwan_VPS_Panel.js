// 台湾 VPS 面板 - Surge 面板版
// 用 $task.fetch 走 海外节点; 不再用 $httpClient 的 policy 参数(疑似面板里不生效导致请求挂起).
// 另加 8 秒兜底: 请求一直没回就显示查询失败, 面板不再一直空白.
var _start = Date.now();
var _done = false;
function finish(o) { if (!_done) { _done = true; $done(o); } }
setTimeout(function() {
  finish({ title: '台湾 VPS · 查询失败', content: '点一下重试', icon: 'exclamationmark.triangle', 'icon-color': '#FF9500' });
}, 8000);
$task.fetch({ url: 'https://4.ipwho.de/json', policy: '海外节点', timeout: 5 }).then(function(resp) {
  try {
    var d = JSON.parse(resp.body);
    var latency = Date.now() - _start;
    var loc = (d.country_code || '') + ' ' + (d.city_name || '');
    var isp = d.asn ? ('AS' + d.asn + ' ' + (d.as_desc || '')) : '未知';
    finish({
      title: '台湾 VPS · ' + d.ip,
      content: '出口: ' + loc + '  延迟: ' + latency + 'ms\nISP: ' + isp + '\n套餐: NAT2 $1.28/月  1000G  到期 2026-12-07\n节点: VLESS 50139 / Trojan 37160·19731',
      icon: 'server.rack', 'icon-color': '#007AFF'
    });
  } catch (e) {
    finish({ title: '台湾 VPS · 查询失败', content: '点一下重试', icon: 'exclamationmark.triangle', 'icon-color': '#FF9500' });
  }
}, function() {
  finish({ title: '台湾 VPS · 查询失败', content: '点一下重试', icon: 'exclamationmark.triangle', 'icon-color': '#FF9500' });
});
