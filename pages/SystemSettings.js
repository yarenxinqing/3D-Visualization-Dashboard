import React, { useState } from 'react';
import './SystemSettings.css';

const SystemSettings = () => {
  // 设备列表状态
  const [devices, setDevices] = useState([]);
  // 新设备表单状态
  const [newDevice, setNewDevice] = useState({
    id: '',
    name: '',
    protocol: 'mqtt',
    ip: '',
    port: '',
    status: 'offline'
  });

  // 生成唯一设备ID
  const generateDeviceId = () => {
    return 'dev_' + Math.random().toString(36).substr(2, 9);
  };

  // 添加设备处理函数
  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.ip || !newDevice.port) {
      alert('请填写设备名称、IP地址和端口');
      return;
    }

    const deviceToAdd = {
      ...newDevice,
      id: generateDeviceId(),
      status: 'offline' // 初始状态为离线
    };

    setDevices([...devices, deviceToAdd]);
    // 重置表单
    setNewDevice({
      id: '',
      name: '',
      protocol: 'mqtt',
      ip: '',
      port: '',
      status: 'offline'
    });
  };

  return (
    <div className="system-settings-container">
      <h1>系统设置</h1>
<button className="back-btn" onClick={() => window.location.href='/'}>返回首页</button>
      <div className="settings-section">
        <h2>基本配置</h2>
        <div className="setting-item">
          <label>语言设置</label>
          <select defaultValue="zh-CN">
            <option value="zh-CN">简体中文</option>
            <option value="en-US">English</option>
          </select>
        </div>
        <div className="setting-item">
          <label>主题模式</label>
          <select defaultValue="dark">
            <option value="dark">深色模式</option>
            <option value="light">浅色模式</option>
          </select>
        </div>
      </div>
      <div className="settings-section">
        <h2>数据同步</h2>
        <div className="setting-item">
          <label>自动同步</label>
          <input type="checkbox" defaultChecked />
        </div>
        <div className="setting-item">
          <label>同步频率</label>
          <select defaultValue="hourly">
            <option value="hourly">每小时</option>
            <option value="daily">每天</option>
            <option value="weekly">每周</option>
          </select>
        </div>
      </div>
      <div className="settings-section">
        <h2>通知设置</h2>
        <div className="setting-item">
          <label>设备告警</label>
          <input type="checkbox" defaultChecked />
        </div>
        <div className="setting-item">
          <label>系统更新</label>
          <input type="checkbox" defaultChecked />
        </div>
      </div>
      <div className="settings-section">
        <h2>设备管理</h2>
        <div className="device-list">
          <h3>已添加设备</h3>
          {devices.length === 0 ? (
            <p>暂无设备，请添加设备</p>
          ) : (
            <table className="device-table">
              <thead>
                <tr>
                  <th>设备名称</th>
                  <th>协议类型</th>
                  <th>IP地址</th>
                  <th>端口</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.id}>
                    <td>{device.name}</td>
                    <td>{device.protocol}</td>
                    <td>{device.ip}</td>
                    <td>{device.port}</td>
                    <td><span className={`status-badge ${device.status}`}>{device.status === 'online' ? '在线' : '离线'}</span></td>
                    <td>
                      <button className="edit-btn">编辑</button>
                      <button className="delete-btn">删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="add-device-form">
          <h3>添加新设备</h3>
          <div className="form-group">
            <label>设备名称</label>
            <input
              type="text"
              value={newDevice.name}
              onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
              placeholder="输入设备名称"
            />
          </div>
          <div className="form-group">
            <label>协议类型</label>
            <select
              value={newDevice.protocol}
              onChange={(e) => setNewDevice({...newDevice, protocol: e.target.value})}
            >
              <option value="mqtt">MQTT</option>
              <option value="http">HTTP</option>
              <option value="tcp">TCP</option>
              <option value="udp">UDP</option>
            </select>
          </div>
          <div className="form-group">
            <label>IP地址</label>
            <input
              type="text"
              value={newDevice.ip}
              onChange={(e) => setNewDevice({...newDevice, ip: e.target.value})}
              placeholder="输入设备IP"
            />
          </div>
          <div className="form-group">
            <label>端口</label>
            <input
              type="number"
              value={newDevice.port}
              onChange={(e) => setNewDevice({...newDevice, port: e.target.value})}
              placeholder="输入端口号"
            />
          </div>
          <button className="add-device-btn" onClick={handleAddDevice}>添加设备</button>
        </div>
      </div>
      <button className="save-settings-btn">保存设置</button>
    </div>
  );
};

export default SystemSettings;