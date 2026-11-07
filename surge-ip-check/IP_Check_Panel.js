// IP Check 面板 - Surge 面板版(按 vfelix7 IP 纯净度模块的写法)
// 面板脚本以 type=generic 注册在 [Script], [Panel] 用 script-name 引用, 并带默认标题.
// 策略组从模块参数 Proxy 取(默认 海外节点), 用 $httpClient.get + $done({title, content, style}).
var args = (typeof $argument === 'string' ? $argument : '');
var policy = '海外节点';
if (args.indexOf('Proxy=') === 0) policy = args.slice(6).split('&')[0].trim() || '海外节点';
try {
  $httpClient.get({ url: 'https://4.ipwho.de/json', headers: { Accept: 'application/json', 'User-Agent': 'Surge IP Check Panel' }, timeout: 8, policy: policy, 'auto-cookie': false }, function(err, resp, data) {
    try {
      if (err) throw new Error('req failed');
      var d = JSON.parse(data);
      var loc = (d.country_code || '') + ' ' + (d.city_name || '');
      var isp = d.asn ? ('AS' + d.asn + ' ' + (d.as_desc || '')) : '未知';
      $done({ title: 'IP ' + d.ip, content: '出口: ' + loc + '\nISP: ' + isp, style: 'good' });
    } catch (e) {
      $done({ title: 'IP 查询失败', content: '点一下面板重试\n策略组: ' + policy, style: 'error' });
    }
  });
} catch (e) {
  $done({ title: 'IP 面板', content: '脚本已运行, 请求未发出\n点一下面板重试', style: 'error' });
}
