// IP Check 面板 - Surge 面板版
// 用 $task.fetch 走 海外节点; 不再用 $httpClient 的 policy 参数(疑似面板里不生效导致请求挂起).
var _start = Date.now();
$task.fetch({ url: 'https://4.ipwho.de/json', policy: '海外节点', timeout: 5 }).then(function(resp) {
  try {
    var d = JSON.parse(resp.body);
    var loc = (d.country_code || '') + ' ' + (d.city_name || '');
    var isp = d.asn ? ('AS' + d.asn + ' ' + (d.as_desc || '')) : '未知';
    $done({ title: 'IP ' + d.ip, content: '出口: ' + loc + '\nISP: ' + isp, icon: 'network', 'icon-color': '#007AFF' });
  } catch (e) {
    $done({ title: 'IP 查询失败', content: '点一下重试', icon: 'exclamationmark.triangle', 'icon-color': '#FF9500' });
  }
}, function() {
  $done({ title: 'IP 查询失败', content: '点一下重试', icon: 'exclamationmark.triangle', 'icon-color': '#FF9500' });
});
