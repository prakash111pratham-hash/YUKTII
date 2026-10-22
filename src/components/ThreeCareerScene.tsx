import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Eye, RotateCw } from 'lucide-react';

export const ThreeCareerScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeBranchHover, setActiveBranchHover] = useState<string>('CSE & Systems');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = 300;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f172a, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4, 9);
    camera.lookAt(0, 0.5, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. PBR Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0x818cf8, 0x1e1b4b, 1.2);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 2.0);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x6366f1, 3.0, 15);
    pointLight.position.set(0, 1, 0);
    scene.add(pointLight);

    // 4. Composite 3-12 Part Procedural Model: "YUKTI Career Galaxy Core"
    const coreGroup = new THREE.Group();

    // Part 1: Central Glowing Nucleus
    const nucleusGeo = new THREE.IcosahedronGeometry(0.85, 2);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: false,
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    coreGroup.add(nucleusMesh);

    // Part 2: Inner Wireframe Energy Cage
    const wireGeo = new THREE.IcosahedronGeometry(0.95, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xa5b4fc,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    coreGroup.add(wireMesh);

    // Part 3: Inner Gyroscope Ring
    const ringGeo1 = new THREE.TorusGeometry(1.4, 0.04, 16, 64);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.1,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    // Part 4: Outer Gyroscope Ring
    const ringGeo2 = new THREE.TorusGeometry(1.8, 0.04, 16, 64);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      metalness: 0.9,
      roughness: 0.15,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    coreGroup.add(ring2);

    // Part 5-8: Four Orbiting Engineering Branch Satellites
    const branches = [
      { name: 'CSE & Software', color: 0x6366f1, radius: 2.7, speed: 0.8, size: 0.28 },
      { name: 'AIML & Neural Data', color: 0xa855f7, radius: 3.4, speed: 0.6, size: 0.25 },
      { name: 'ECE & Semiconductor', color: 0x06b6d4, radius: 4.1, speed: 0.45, size: 0.26 },
      { name: 'Mech & EV Robotics', color: 0xf59e0b, radius: 4.8, speed: 0.35, size: 0.24 },
    ];

    const satellites: { mesh: THREE.Mesh; orbitRadius: number; speed: number; name: string }[] = [];

    branches.forEach((b) => {
      const satGeo = new THREE.DodecahedronGeometry(b.size);
      const satMat = new THREE.MeshStandardMaterial({
        color: b.color,
        metalness: 0.7,
        roughness: 0.3,
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      scene.add(satMesh);
      satellites.push({ mesh: satMesh, orbitRadius: b.radius, speed: b.speed, name: b.name });
    });

    // Part 9: Ambient Ground Contact Shadow Disc
    const shadowGeo = new THREE.CircleGeometry(2.5, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x020617,
      transparent: true,
      opacity: 0.5,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.5;
    scene.add(shadowMesh);

    // Part 10: Ambient Data Particles
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 12;
      particlePos[i + 1] = (Math.random() - 0.5) * 5 + 0.5;
      particlePos[i + 2] = (Math.random() - 0.5) * 12;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    scene.add(coreGroup);

    // 5. Interaction: Mouse drag to rotate camera smoothly
    let isDragging = false;
    let prevMouseX = 0;
    let targetAngle = 0;
    let currentAngle = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      prevMouseX = e.clientX;
      targetAngle += deltaX * 0.008;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 6. Lossless 60fps Animation Loop with Exponential Damping
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const time = clock.getElapsedTime();

      // Exponential damping for interactive rotation
      currentAngle += (targetAngle - currentAngle) * (1 - Math.exp(-10 * dt));

      camera.position.x = Math.sin(currentAngle) * 8.5;
      camera.position.z = Math.cos(currentAngle) * 8.5;
      camera.lookAt(0, 0.2, 0);

      // Core rotation
      coreGroup.rotation.y += 0.008;
      nucleusMesh.rotation.x += 0.005;
      wireMesh.rotation.y -= 0.006;
      ring1.rotation.z += 0.012;
      ring2.rotation.x += 0.009;

      // Orbiting branch satellites
      satellites.forEach((sat, idx) => {
        const theta = time * sat.speed + (idx * Math.PI) / 2;
        sat.mesh.position.x = Math.cos(theta) * sat.orbitRadius;
        sat.mesh.position.z = Math.sin(theta) * sat.orbitRadius;
        sat.mesh.position.y = Math.sin(time * 1.5 + idx) * 0.3;
        sat.mesh.rotation.y += 0.02;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      camera.aspect = newW / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-[300px] cursor-grab active:cursor-grabbing" />

      {/* Floating HUD Overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-400/30 backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-amber-300" /> 3D YUKTI Career Orbit
        </div>
        <h3 className="text-sm font-extrabold text-white mt-1">Interactive Engineering Galaxy</h3>
        <span className="text-[10px] text-slate-400 block">Drag to rotate • 4 Branches in synchronous orbit</span>
      </div>

      <div className="absolute bottom-3 right-4 z-10 text-[10px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
        Three.js PBR Studio Lighting
      </div>
    </div>
  );
};
