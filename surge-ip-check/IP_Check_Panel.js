// IP Check 面板 - Surge 面板版(兜底版)
// 不管请求成不成, 只要脚本跑起来就一定显示内容:
// 先查 4.ipwho.de 拿出口 IP, 查不到就显示静态提示, 绝不留白.
var _start = Date.now();
try {
  $httpClient.get({ url: 'https://4.ipwho.de/json', policy: '海外节点', timeout: 3 }, function(err, resp, data) {
    try {
      if (err) throw new Error('req failed');
      var d = JSON.parse(data);
      var loc = (d.country_code || '') + ' ' + (d.city_name || '');
      var isp = d.asn ? ('AS' + d.asn + ' ' + (d.as_desc || '')) : '未知';
      $done({ title: 'IP ' + d.ip, content: '出口: ' + loc + '\nISP: ' + isp, icon: 'network', 'icon-color': '#007AFF' });
    } catch (e) {
      $done({ title: 'IP 查询失败', content: '点一下面板重试\n节点: 海外节点', icon: 'exclamationmark.triangle', 'icon-color': '#FF9500' });
    }
  });
} catch (e) {
  $done({ title: 'IP 面板', content: '脚本已运行, 请求未发出\n点一下面板重试', icon: 'network', 'icon-color': '#007AFF' });
}
