import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';
import { PlayRegular } from '@fluentui/react-icons';
import videoUrl from '../annimation-clip/bg-removed-traditional.mp4';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D videoMap;
  uniform vec3 keyColor;
  varying vec2 vUv;
  void main() {
    vec4 frame = texture2D(videoMap, vUv);
    frame = sRGBTransferEOTF(frame);
    float highest = max(frame.r, max(frame.g, frame.b));
    float lowest = min(frame.r, min(frame.g, frame.b));
    float saturation = highest - lowest;
    float neutral = 1.0 - smoothstep(0.012, 0.045, saturation);
    float keyDistance = distance(frame.rgb, keyColor);
    float matte = smoothstep(0.012, 0.044, keyDistance);
    float alpha = mix(1.0, matte, neutral);
    gl_FragColor = vec4(frame.rgb, frame.a * alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export default function CoupleVideoScene() {
  const hostRef = useRef(null);
  const videoRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [playbackBlocked, setPlaybackBlocked] = useState(false);

  function retryPlayback() {
    videoRef.current?.play()
      .then(() => setPlaybackBlocked(false))
      .catch(() => setPlaybackBlocked(true));
  }

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !window.WebGLRenderingContext) {
      return undefined;
    }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
        powerPreference: 'low-power',
      });
    } catch {
      return undefined;
    }

    const video = document.createElement('video');
    videoRef.current = video;
    video.src = videoUrl;
    video.loop = true;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.autoplay = !reducedMotion;
    video.preload = 'auto';
    video.crossOrigin = 'anonymous';
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    if (!reducedMotion) video.setAttribute('autoplay', '');
    video.style.position = 'absolute';
    video.style.inset = '0';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.opacity = '0.001';
    video.style.pointerEvents = 'none';
    video.setAttribute('aria-hidden', 'true');
    host.appendChild(video);

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    const backgroundRemovedVideo = new THREE.ShaderMaterial({
      uniforms: {
        videoMap: { value: texture },
        keyColor: { value: new THREE.Color('#37393a') },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-4.1, 4.1, 2.3, -2.3, 0.1, 30);
    camera.position.set(0, 2.25, 10);
    camera.lookAt(0, 2.25, 0);
    const couple = new THREE.Mesh(new THREE.PlaneGeometry((16 / 9) * 4.35, 4.35), backgroundRemovedVideo);
    couple.position.y = 2.2;
    scene.add(couple);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(host.clientWidth, host.clientHeight, false);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.appendChild(renderer.domElement);

    let animationFrame = 0;
    let disposed = false;
    function render() {
      if (disposed) return;
      renderer.render(scene, camera);
      if (!reducedMotion) animationFrame = window.requestAnimationFrame(render);
    }

    function resize() {
      if (!host.clientWidth || !host.clientHeight) return;
      const hostAspect = host.clientWidth / host.clientHeight;
      const videoAspect = 16 / 9;
      const viewHeight = hostAspect < videoAspect ? 4.35 * (videoAspect / hostAspect) : 4.35;
      camera.left = -(viewHeight * hostAspect) / 2;
      camera.right = (viewHeight * hostAspect) / 2;
      camera.top = viewHeight / 2;
      camera.bottom = -viewHeight / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight, false);
      render();
    }

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    video.addEventListener('loadeddata', render);
    video.addEventListener('playing', () => setPlaybackBlocked(false), { once: true });
    resize();
    if (reducedMotion) video.currentTime = 0;
    else video.play().catch(() => setPlaybackBlocked(true));

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      video.pause();
      videoRef.current = null;
      video.removeAttribute('src');
      video.load();
      video.remove();
      texture.dispose();
      couple.geometry.dispose();
      backgroundRemovedVideo.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reducedMotion]);

  return (
    <div className="couple-scene-wrap">
      <div
        className="couple-scene"
        ref={hostRef}
        role="img"
        aria-label="The supplied animated couple video with its charcoal checkerboard background removed"
      />
      {playbackBlocked && !reducedMotion && (
        <button className="couple-video-play" type="button" onClick={retryPlayback}>
          <PlayRegular aria-hidden="true" />
          Tap to play animation
        </button>
      )}
      <p className="sr-only">The provided couple animation plays over the invitation's own background before the invitation is opened.</p>
    </div>
  );
}