import localtunnel from 'localtunnel';
import fs from 'fs';

(async () => {
  const tunnel = await localtunnel({ port: 5173 });

  const message = `
🌐 公网访问地址：
${'━'.repeat(50)}
${tunnel.url}
${'━'.repeat(50)}

你可以在手机上打开这个链接访问你的应用！
`;

  console.log(message);
  fs.writeFileSync('/home/user/lifting/tunnel-url.txt', tunnel.url);

  tunnel.on('close', () => {
    console.log('隧道已关闭');
  });
})();
