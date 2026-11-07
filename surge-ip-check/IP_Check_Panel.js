// IP Check 面板 - Surge 面板版(极简重建)
// 只要 $httpClient + $done, 不用 async/Promise/新接口, 不带城市翻译表.
// 先在 海外节点组选好要测的节点, 面板显示的就是该节点的出口 IP.
var _start = Date.now();
$httpClient.get(
  { url: 'https://4.ipwho.de/json', policy: '海外节点', timeout: 5 },
  function(err, resp, data) {
    if (err) {
      $done({ title: 'IP 查询失败', content: '点一下重试', icon: 'exclamationmark.triangle', 'icon-color': '#FF9500' });
      return;
    }
    try {
      var d = JSON.parse(data);
      var loc = (d.country_code || '') + ' ' + (d.city_name || '');
      var isp = d.asn ? ('AS' + d.asn + ' ' + (d.as_desc || '')) : '未知';
      $done({
        title: 'IP ' + d.ip,
        content: '出口: ' + loc + '\nISP: ' + isp,
        icon: 'network',
        'icon-color': '#007AFF'
      });
    } catch (e) {
      $done({ title: 'IP 查询失败', content: '点一下重试', icon: 'exclamationmark.triangle', 'icon-color': '#FF9500' });
    }
  }
);
