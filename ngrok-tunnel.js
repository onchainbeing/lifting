import ngrok from '@ngrok/ngrok';
import fs from 'fs';

(async () => {
  try {
    const listener = await ngrok.forward({ addr: 5173, authtoken_from_env: true });
    const url = listener.url();

    const message = `
🌐 公网访问地址：
${'━'.repeat(50)}
${url}
${'━'.repeat(50)}

你可以在手机上打开这个链接访问你的应用！
`;

    console.log(message);
    fs.writeFileSync('/home/user/lifting/ngrok-url.txt', url);

    console.log('\n隧道已建立，按 Ctrl+C 停止\n');

  } catch (err) {
    console.error('❌ 错误:', err.message);
    process.exit(1);
  }
})();
