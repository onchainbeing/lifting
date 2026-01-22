import { useState } from 'react';
import { getBarkUrl, setBarkUrl } from '../services/storage';
import { sendBarkNotification } from '../services/notification';
import './Settings.css';

export default function Settings() {
  const [barkUrl, setBarkUrlState] = useState(() => getBarkUrl());
  const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSave = () => {
    setBarkUrl(barkUrl.trim());
    alert('设置已保存');
  };

  const handleTest = async () => {
    if (!barkUrl.trim()) {
      alert('请先输入 Bark 服务器地址');
      return;
    }

    setTestStatus('sending');
    // 临时保存以便测试
    setBarkUrl(barkUrl.trim());

    const success = await sendBarkNotification('测试通知', '如果你看到这条消息，说明 Bark 配置成功！');

    if (success) {
      setTestStatus('success');
      // 提示用户检查手机
      alert('已发送！请检查 iPhone 是否收到通知');
      setTimeout(() => setTestStatus('idle'), 2000);
    } else {
      setTestStatus('error');
      setTimeout(() => setTestStatus('idle'), 3000);
    }
  };

  return (
    <div className="settings">
      <h2>设置</h2>

      <div className="settings-section">
        <h3>Bark 推送通知</h3>
        <p className="settings-description">
          保存训练记录后，自动向你的 iPhone 推送通知。
          <br />
          需要先在 iPhone 上安装 Bark App，然后复制推送地址。
        </p>

        <div className="form-group">
          <label htmlFor="bark-url">Bark 服务器地址</label>
          <input
            id="bark-url"
            type="text"
            value={barkUrl}
            onChange={(e) => setBarkUrlState(e.target.value)}
            placeholder="https://api.day.app/YOUR_KEY"
            className="text-input"
          />
        </div>

        <div className="settings-actions">
          <button className="btn-save-settings" onClick={handleSave}>
            保存设置
          </button>
          <button
            className={`btn-test ${testStatus}`}
            onClick={handleTest}
            disabled={testStatus === 'sending'}
          >
            {testStatus === 'sending' && '发送中...'}
            {testStatus === 'success' && '已发送'}
            {testStatus === 'error' && '发送失败'}
            {testStatus === 'idle' && '测试推送'}
          </button>
        </div>
      </div>
    </div>
  );
}
