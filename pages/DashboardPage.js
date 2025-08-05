import React, { useEffect, useState } from 'react';
import './DashboardPage.css';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer, Cell } from 'recharts';
import ThreeDVisualization from '../components/ThreeDVisualization';

// 模拟生产数据
const productionData = [
  { name: '8:00', value: 120 },
  { name: '9:00', value: 190 },
  { name: '10:00', value: 150 },
  { name: '11:00', value: 280 },
  { name: '12:00', value: 180 },
  { name: '13:00', value: 90 },
  { name: '14:00', value: 220 },
  { name: '15:00', value: 290 },
  { name: '16:00', value: 320 },
];

  // 能耗统计图表数据
  const energyConsumptionData = [
    { month: '1月', electricity: 400, water: 240 },
    { month: '2月', electricity: 300, water: 280 },
    { month: '3月', electricity: 350, water: 320 },
    { month: '4月', electricity: 410, water: 380 },
    { month: '5月', electricity: 380, water: 360 },
    { month: '6月', electricity: 450, water: 420 },
  ];

  //

// 设备状态数据
const equipmentStatusData = [
  { name: '正常', value: 18, color: '#00ff00' },
  { name: '警告', value: 3, color: '#ffff00' },
  { name: '故障', value: 1, color: '#ff0000' },
];

// 停机原因数据
const downtimeReasonData = [
  { name: '未填写', value: 85, color: '#ff7a00', strokeWidth: 1 },
  { name: '小停机', value: 65, color: '#ffcc00', strokeWidth: 1 },
  { name: '取放', value: 45, color: '#0099ff', strokeWidth: 1},
  { name: '故障', value: 50, color: '#ff3300', strokeWidth: 1 },
];


// 不良数量统计
const defectData = [
  { name: '产品缺陷', value: 25 },
  { name: '尺寸超差', value: 18 },
  { name: '表面瑕疵', value: 12 },
  { name: '操作失误', value: 8 },
  { name: '未检出', value: 5 },
];

const DashboardPage = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [productionRate, setProductionRate] = useState(0);
  const [targetProduction, setTargetProduction] = useState(350);
  const [actualProduction, setActualProduction] = useState(280);
  const [currentNavItem, setCurrentNavItem] = useState('首页');

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // 模拟生产进度
    const progressTimer = setInterval(() => {
      setProductionRate(prev => {
        const newRate = prev + 0.1;
        return newRate > 100 ? 0 : newRate;
      });
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>3D可视化数字孪生平台</h1>
      </div> <div className="dashboard-header">
        <div className="current-time">{currentTime.toLocaleString()}</div>
      </div>

      <div className="dashboard-nav">
  
        <button className={`nav-btn ${currentNavItem === '首页' ? 'active' : ''}`} onClick={() => setCurrentNavItem('首页')}>首页</button>
        <button className={`nav-btn ${currentNavItem === '加工机A(MVC3650)' ? 'active' : ''}`} onClick={() => setCurrentNavItem('加工机A(MVC3650)')}>加工机A(MVC3650)</button>
        <button className={`nav-btn ${currentNavItem === '加工机B(MVC10000)' ? 'active' : ''}`} onClick={() => setCurrentNavItem('加工机B(MVC10000)')}>加工机B(MVC10000)</button>
        <button className={`nav-btn ${currentNavItem === '主轴(MVC950R)' ? 'active' : ''}`} onClick={() => setCurrentNavItem('主轴(MVC950R)')}>主轴(MVC950R)</button>
        <button className={`nav-btn ${currentNavItem === '北京精雕JDVT600T' ? 'active' : ''}`} onClick={() => setCurrentNavItem('北京精雕JDVT600T')}>北京精雕JDVT600T</button>
        <button className={`nav-btn ${currentNavItem === '其他设备' ? 'active' : ''}`} onClick={() => setCurrentNavItem('其他设备')}>其他设备</button>
        <button className={`nav-btn ${currentNavItem === '当前停机原因(分钟)' ? 'active' : ''}`} onClick={() => setCurrentNavItem('当前停机原因(分钟)')}>当前停机原因(分钟)</button>
        <button className="nav-btn" onClick={() => window.location.href='/settings'}>设置</button>
        <button className="nav-btn fullscreen-btn" onClick={toggleFullscreen}>
          {isFullscreen ? '退出全屏' : '全屏'}
        </button>
      </div>

      <div className="dashboard-content">
        <div className="left-panel">
           <div className="stat-card">
            <h3>当日实时情况分布</h3>
            <ResponsiveContainer width="80%" height={180}>
              <PieChart>
                <Pie
                  data={[
                    { name: '运行', value: 5, color: '#00ff00' },
                    { name: '停机', value: 2, color: '#ffff00' },
                    { name: '离线', value: 1, color: '#888888' },
                    { name: '维修', value: 1, color: '#add8e6' },
                    { name: '报警', value: 1, color: '#ff0000' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={56}
                  paddingAngle={2}
                  cornerRadius={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {[{
                    name: '运行', value: 5, color: '#00ff00'
                  }, {
                    name: '停机', value: 2, color: '#ffff00'
                  }, {
                    name: '离线', value: 1, color: '#888888'
                  }, {
                    name: '维修', value: 1, color: '#091fff'
                  }, {
                    name: '报警', value: 1, color: '#ff0000'
                  }].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}台`, '数量']} contentStyle={{ backgroundColor: '#ffffff', color: '#000000', borderRadius: '8px', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
          
          </div>

          <div className="stat-card">
            <h3>当班状态统计</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={[
                   { name: '加工', value: 4 },
                   { name: '停机', value: 3 },
                   { name: '断开', value: 1 },
                   { name: '离线', value: 0 },
                   { name: '报警', value: 0 },
                   { name: '换线', value: 0 },
                   { name: '故障', value: 1 },
                   { name: '维修', value: 1 }
                ]} margin={{ top: 5, right: 5, bottom: 0, left: -40 }}>
              
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="name" type="category" axisLine={false} tickLine={false} stroke="#fff" angle={-45} textAnchor="end" />
                <YAxis axisLine={false} tickLine={false} stroke="#ccc" domain={[0, 4]} tickCount={9} />
                <Tooltip formatter={(value) => [`${value}台`, '数量']} contentStyle={{ backgroundColor: '#ffffff', color: '#000000', borderRadius: '8px', border: 'none' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={15}>
                  {[
                    { name: '加工', value: 4, color: '#00ffff' },
                    { name: '停机', value: 3, color: '#00ff00' },
                    { name: '断开', value: 2, color: '#ffff00' },
                    { name: '离线', value: 1, color: '#ff9900' },
                    { name: '报警', value: 2, color: '#ff6600' },
                    { name: '换线', value: 3, color: '#6666ff' },
                    { name: '故障', value: 1, color: '#ff0000' },
                    { name: '维修', value: 1, color: '#add8e6' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

         
            <div className="stat-card">
              <h3>实时作业状态分布</h3>
              <div className="status-distribution">
                <div className="status-item">
                  <span className="status-label">正常作业(0)</span>
                  <div className="status-bar" style={{ width: '0%', backgroundColor: '#4CAF50' }}></div>
                </div>
                <div className="status-item">
                  <span className="status-label">稍微落后(1)</span>
                  <div className="status-bar" style={{ width: '6.25%', backgroundColor: '#FFC107' }}></div>
                </div>
                <div className="status-item">
                  <span className="status-label">严重落后(3)</span>
                  <div className="status-bar" style={{ width: '18.75%', backgroundColor: '#FF5722' }}></div>
                </div>
                <div className="status-item">
                  <span className="status-label">暂无作业(10)</span>
                  <div className="status-bar" style={{ width: '62.5%', backgroundColor: '#9E9E9E' }}></div>
                </div>
              </div>
            </div>
            

          <div className="stat-card">
            <h3>当前设备开动率排行</h3>
            <div className="ranking-list">
              <div className="ranking-list-inner">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="ranking-item">
                    <div className="rank">{i}</div>
                    <div className="equipment">立加04(VC0240)</div>
                    <div className="rate">{100 - (i*2)}%</div>
                  </div>
                ))}
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={`${i}-copy`} className="ranking-item">
                    <div className="rank">{i}</div>
                    <div className="equipment">立加04(VC0240)</div>
                    <div className="rate">{100 - (i*2)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="center-panel">
          <ThreeDVisualization />
        </div>

        <div className="right-panel">
          <div className="stat-card">
            <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: '16px' }}>当前停机原因(分钟)</h3>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={downtimeReasonData} height={190} margin={{ top: 20, right: 20, left: -30, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444" />
                <XAxis dataKey="name" type="category" axisLine={false} tickLine={false} stroke="#fff" angle={-45} textAnchor="end" />
<YAxis type="number" axisLine={false} tickLine={false} stroke="#ccc" domain={[0, 200]} />
<Tooltip content={({ active, payload, label }) => active && payload && payload.length ? (<div style={{ backgroundColor: '#ffffff', color: '#000000', border: 'none', padding: '5px 10px', borderRadius: '8px' }}><p style={{ margin: 0 }}>停机时间</p><p style={{ margin: 0 }}>{payload[0].value}分钟</p></div>) : null} />
<Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={18}>
  {downtimeReasonData.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={entry.color} />
  ))}
  
</Bar>
        

<LabelList dataKey="value" position="right" fill="#fff" fontSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="stat-card">
            <h3>当前不良数量统计</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={defectData} margin={{ top: 5, right: 5, bottom: 5, left: -30 }}>
                <defs>
                  <linearGradient id="colorDefects" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', color: '#000000', borderRadius: '8px', border: 'none' }} />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorDefects)" />
              </AreaChart>
              
            </ResponsiveContainer>
           </div>

          <div className="stat-card">
            <h3>能耗统计</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#ccc' }}>
              <div>单位: KWh</div>
              <div>单位: t</div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={energyConsumptionData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="electricityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff00" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00ff00" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} stroke="#ccc" />
                <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} stroke="#00ff00" domain={[0, 500]} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} stroke="#0099ff" domain={[0, 500]} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', color: '#000000', borderRadius: '8px', border: 'none' }} />
                <Legend />
                <Bar yAxisId="left" dataKey="electricity" name="电耗趋势" fill="url(#electricityGradient)" radius={[4, 4, 0, 0]} barSize={18} />
                <Line yAxisId="right" type="monotone" dataKey="water" name="水耗趋势" stroke="#0099ff" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;