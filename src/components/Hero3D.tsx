import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { prefersReducedMotion } from '../lib/usePrefersReducedMotion'

/** Ashima/IQ 3D simplex noise, shared by the displacement shader. */
const SIMPLEX_NOISE = /* glsl */ `
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 1.0 / 7.0;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`

const VERTEX_SHADER = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
varying vec3 vView;
varying float vNoise;
${SIMPLEX_NOISE}
void main() {
  float n = snoise(position * uFreq + vec3(0.0, uTime * 0.22, uTime * 0.15));
  vec3 displaced = position + normal * (n * uAmp);
  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  vView = mv.xyz;
  vNoise = n;
  gl_Position = projectionMatrix * mv;
}
`

const FRAGMENT_SHADER = /* glsl */ `
uniform vec3 uBase;
uniform vec3 uTone;
uniform vec3 uAccent;
varying vec3 vView;
varying float vNoise;
void main() {
  vec3 N = normalize(cross(dFdx(vView), dFdy(vView)));
  vec3 V = normalize(-vView);
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.6);
  vec3 L = normalize(vec3(0.55, 0.85, 0.45));
  float diffuse = max(dot(N, L), 0.0);
  float spec = pow(max(dot(reflect(-L, N), V), 0.0), 48.0);
  vec3 color = mix(uBase, uTone, vNoise * 0.5 + 0.5);
  color += uTone * diffuse * 0.4;
  color += vec3(1.0) * spec * 0.35;
  color += uAccent * fresnel * 0.85;
  gl_FragColor = vec4(color, 1.0);
}
`

function makeParticles(count: number, innerRadius: number, outerRadius: number) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const radius = innerRadius + Math.random() * (outerRadius - innerRadius)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  return geometry
}

/**
 * The hero's WebGL backdrop: a noise-displaced, faceted orb with an electric
 * rim light, orbited by a sparse particle field and a slow wireframe shell.
 * Responds to pointer position and the first viewport of scroll. Renders a
 * single static frame under reduced motion, and pauses off-screen.
 */
export default function Hero3D({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch {
      setFailed(true)
      return
    }

    const reduced = prefersReducedMotion()
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60)
    camera.position.set(0, 0, 6.4)

    const group = new THREE.Group()
    scene.add(group)

    const uniforms = {
      uTime: { value: 0 },
      uAmp: { value: 0.42 },
      uFreq: { value: 1.15 },
      uBase: { value: new THREE.Color('#101013') },
      uTone: { value: new THREE.Color('#43434b') },
      uAccent: { value: new THREE.Color('#D9FF3F') },
    }

    const blobGeometry = new THREE.IcosahedronGeometry(1.7, 40)
    const blobMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    })
    const blob = new THREE.Mesh(blobGeometry, blobMaterial)
    group.add(blob)

    const shellGeometry = new THREE.IcosahedronGeometry(2.7, 1)
    const shellMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.05,
    })
    const shell = new THREE.Mesh(shellGeometry, shellMaterial)
    group.add(shell)

    const dustGeometry = makeParticles(700, 3.1, 6.4)
    const dustMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
      depthWrite: false,
    })
    const dust = new THREE.Points(dustGeometry, dustMaterial)
    scene.add(dust)

    const sparkGeometry = makeParticles(70, 2.6, 5.2)
    const sparkMaterial = new THREE.PointsMaterial({
      color: 0xd9ff3f,
      size: 0.045,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      depthWrite: false,
    })
    const sparks = new THREE.Points(sparkGeometry, sparkMaterial)
    scene.add(sparks)

    // Pointer parallax and first-viewport scroll response.
    let targetX = 0
    let targetY = 0
    let mouseX = 0
    let mouseY = 0
    let scrollProgress = 0
    let orbOffsetX = 0.9

    const onPointerMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth) * 2 - 1
      targetY = (event.clientY / window.innerHeight) * 2 - 1
    }
    const onScroll = () => {
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / window.innerHeight))
    }

    const setSize = () => {
      const width = container.clientWidth || 1
      const height = container.clientHeight || 1
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      // Keep the orb near-centre on portrait screens, offset right on wide ones.
      orbOffsetX = camera.aspect < 0.9 ? 0.15 : 0.9
    }

    const clock = new THREE.Clock()
    let time = Math.random() * 100
    let rafId = 0
    let running = false
    let inView = true
    let pageVisible = !document.hidden

    const renderFrame = () => {
      time += Math.min(clock.getDelta(), 0.05)
      uniforms.uTime.value = time

      mouseX += (targetX - mouseX) * 0.05
      mouseY += (targetY - mouseY) * 0.05

      group.rotation.y = time * 0.1 + mouseX * 0.35
      group.rotation.x = mouseY * 0.22
      group.position.x = orbOffsetX
      group.position.y = scrollProgress * 1.5
      const scale = 1 + scrollProgress * 0.24
      group.scale.setScalar(scale)

      shell.rotation.y = -time * 0.06
      shell.rotation.z = time * 0.04
      dust.rotation.y = time * 0.02
      sparks.rotation.y = -time * 0.014

      camera.position.x = mouseX * 0.3
      camera.position.y = -mouseY * 0.2
      camera.lookAt(orbOffsetX, 0, 0)

      renderer.render(scene, camera)
    }

    const loop = () => {
      renderFrame()
      rafId = requestAnimationFrame(loop)
    }

    const syncRunning = () => {
      const shouldRun = !reduced && inView && pageVisible
      if (shouldRun && !running) {
        running = true
        clock.getDelta()
        rafId = requestAnimationFrame(loop)
      } else if (!shouldRun && running) {
        running = false
        cancelAnimationFrame(rafId)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true
        syncRunning()
      },
      { threshold: 0 },
    )
    observer.observe(container)

    const onVisibility = () => {
      pageVisible = !document.hidden
      syncRunning()
    }

    const resizeObserver = new ResizeObserver(() => {
      setSize()
      if (!running) renderFrame()
    })
    resizeObserver.observe(container)

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    setSize()
    onScroll()
    renderFrame() // Always paint at least one frame (the only one under reduced motion).
    syncRunning()

    return () => {
      running = false
      cancelAnimationFrame(rafId)
      observer.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      blobGeometry.dispose()
      blobMaterial.dispose()
      shellGeometry.dispose()
      shellMaterial.dispose()
      dustGeometry.dispose()
      dustMaterial.dispose()
      sparkGeometry.dispose()
      sparkMaterial.dispose()
      renderer.dispose()
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  if (failed) return null

  return <div ref={containerRef} aria-hidden="true" className={className} />
}
