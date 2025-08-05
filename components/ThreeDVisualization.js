import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import './ThreeDVisualization.css';

const ThreeDVisualization = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
    const css2DRendererRef = useRef(null);
  const machineRef = useRef(null);
const labelsAdded = useRef(false);
const particlesMeshRef = useRef(null);


  useEffect(() => {
    // 初始化场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1124);
    sceneRef.current = scene;

    // 添加网格辅助线
    const gridHelper = new THREE.GridHelper(100, 20, 0x003366, 0x003366);
    scene.add(gridHelper);

    // 初始化相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 5);
    scene.add(ambientLight);

    // 添加方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3.0);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // 添加第二个方向光
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight2.position.set(-10, 15, -10);
    scene.add(directionalLight2);

    // 配置阴影属性
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;

    // 创建粒子系统
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20; // 分布在-10到10之间
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x3b82f6,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.8
    });
    
    particlesMeshRef.current = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMeshRef.current);

    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // 添加到DOM
    containerRef.current.appendChild(renderer.domElement);

    // 初始化CSS2D渲染器用于标签
    const css2DRenderer = new CSS2DRenderer();
    css2DRenderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    css2DRenderer.domElement.style.position = 'absolute';
    css2DRenderer.domElement.style.top = '0';
    css2DRenderer.domElement.style.pointerEvents = 'none';
    containerRef.current.appendChild(css2DRenderer.domElement);
    css2DRendererRef.current = css2DRenderer;

    // 加载3D模型
    const loader = new GLTFLoader();
    loader.load('/models/shuk.glb', (
      gltf
    ) => {
      machineRef.current = gltf.scene;
      machineRef.current.scale.set(1, 1, 1);
      machineRef.current.visible = true;
      // 计算模型边界框并居中
      const box = new THREE.Box3().setFromObject(machineRef.current);
      const center = new THREE.Vector3();
      box.getCenter(center);
      machineRef.current.position.set(-center.x, -center.y + 1.5, -center.z);
      machineRef.current.castShadow = true;
      machineRef.current.receiveShadow = true;
      scene.add(machineRef.current);

      if (!labelsAdded.current) {
        // 定义模型点位数据，可通过修改position来自定义标签位置
        const pointsData = [
          { id: 'point1', name: '加工点A', position: new THREE.Vector3(-3, 2, 5), production: 156, unit: '件/小时' },
          { id: 'point2', name: '加工点B', position: new THREE.Vector3(0, 2, 5), production: 98, unit: '件/小时' },
          { id: 'point3', name: '加工点C', position: new THREE.Vector3(3, 2, 5), production: 124, unit: '件/小时' },
          { id: 'point4', name: '装配点', position: new THREE.Vector3(0, 2, -5), production: 86, unit: '件/小时' }
        ];

        // 创建点位标签
        pointsData.forEach(point => {
          const labelDiv = document.createElement('div');
          labelDiv.className = 'data-label';
labelDiv.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
labelDiv.addEventListener('mouseenter', () => {
  labelDiv.style.transform = 'scale(1.1)';
  labelDiv.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.7)';
});
labelDiv.addEventListener('mouseleave', () => {
  labelDiv.style.transform = 'scale(1)';
  labelDiv.style.boxShadow = 'none';
});
          labelDiv.innerHTML = `
            <div class="label-title">${point.name}</div>
            <div class="label-value">${point.production} ${point.unit}</div>
          `;

          const labelObject = new CSS2DObject(labelDiv);
          // 将标签作为模型子元素，跟随模型移动
          labelObject.position.copy(point.position);
          // 保持标签大小不随模型缩放变化
          const modelScale = machineRef.current.scale;
          labelObject.scale.set(1/modelScale.x, 1/modelScale.y, 1/modelScale.z);
          machineRef.current.add(labelObject);
        });
        labelsAdded.current = true;
      }
    }, undefined, (error) => {
      console.error('模型加载错误:', error);
    });

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);

      // 添加模型旋转效果
    // 更新粒子位置
    if (particlesMeshRef.current) {
      particlesMeshRef.current.rotation.y += 0.001;
    }

    controls.update();
      renderer.render(scene, camera);
      css2DRendererRef.current.render(scene, camera);
    };
    animate();

    // 窗口大小调整处理
    const handleResize = () => {
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      css2DRendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="three-d-container">
      <div ref={containerRef} className="three-d-viewer"></div>
      <div className="machine-stats">
        <div className="stat-item">
          <span className="stat-label">设备总数</span>
          <span className="stat-value">22</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">运行中</span>
          <span className="stat-value">18</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">故障率</span>
          <span className="stat-value">4.5%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">OEE</span>
          <span className="stat-value">86.3%</span>
        </div>
      </div>
    </div>
  );
};

export default ThreeDVisualization;