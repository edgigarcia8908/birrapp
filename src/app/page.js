'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// ARViewer corre solo en el navegador (necesita window + cámara)
const ARViewer = dynamic(
  () => import('@ceo-core/ar').then((mod) => mod.ARViewer),
  { ssr: false, loading: () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0a0a0a', color:'#fff' }}>
      <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🍺</div>
      <p style={{ color:'#aaa' }}>Cargando Motor AR...</p>
    </div>
  )}
);

export default function BirrappHome() {
  const [started, setStarted] = useState(false);
  const [found, setFound] = useState(false);

  return (
    <div style={{ width:'100vw', height:'100vh', background: started ? 'transparent' : '#0a0a0a', color:'#fff', position:'relative', overflow:'hidden' }}>
      {!started ? (
        /* ── SPLASH SCREEN ────────────────────────────────────────── */
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', padding:'2rem', textAlign:'center' }}>

          {/* Logo / Ícono */}
          <div style={{ fontSize:'5rem', marginBottom:'1.5rem', filter:'drop-shadow(0 0 20px rgba(251,191,36,0.6))' }}>🍺</div>

          <h1 style={{ fontSize:'3rem', fontWeight:800, background:'linear-gradient(135deg, #fbbf24, #f97316)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', margin:0 }}>
            Birrapp
          </h1>
          <p style={{ color:'#9ca3af', marginTop:'0.75rem', marginBottom:'2.5rem', fontSize:'1.1rem', maxWidth:'320px', lineHeight:1.5 }}>
            Escanea la etiqueta de tu cerveza y descubre la magia en Realidad Aumentada
          </p>

          <button
            onClick={() => setStarted(true)}
            style={{
              padding:'14px 36px', fontSize:'1.1rem', fontWeight:700,
              background:'linear-gradient(135deg, #fbbf24, #f97316)',
              color:'#0a0a0a', border:'none', borderRadius:'50px',
              cursor:'pointer', boxShadow:'0 0 30px rgba(251,191,36,0.4)',
              transition:'transform 0.2s', letterSpacing:'0.05em'
            }}
            onMouseEnter={e => e.target.style.transform='scale(1.05)'}
            onMouseLeave={e => e.target.style.transform='scale(1)'}
          >
            ✨ Escanear Etiqueta
          </button>

          <p style={{ marginTop:'3rem', fontSize:'0.75rem', color:'#4b5563' }}>
            Powered by <strong style={{color:'#fbbf24'}}>@ceo-core/ar</strong> · MindAR + A-Frame
          </p>
        </div>
      ) : (
        /* ── AR VIEWER ───────────────────────────────────────────── */
        <>
          {/* HUD overlay */}
          <div style={{
            position:'absolute', top:'1rem', left:'1rem', right:'1rem',
            zIndex:100, display:'flex', justifyContent:'space-between', alignItems:'center'
          }}>
            {/* Badge de estado */}
            <div style={{
              background: found ? 'rgba(16,185,129,0.85)' : 'rgba(0,0,0,0.6)',
              backdropFilter:'blur(10px)', border:`1px solid ${found ? '#10b981' : '#374151'}`,
              padding:'6px 14px', borderRadius:'50px', fontSize:'0.85rem', fontWeight:600,
              transition:'all 0.3s'
            }}>
              {found ? '🎯 ¡Etiqueta Detectada!' : '📷 Buscando etiqueta...'}
            </div>

            {/* Botón cerrar */}
            <button
              onClick={() => { setStarted(false); setFound(false); }}
              style={{
                background:'rgba(0,0,0,0.6)', backdropFilter:'blur(10px)',
                border:'1px solid #374151', color:'white', padding:'6px 14px',
                borderRadius:'50px', cursor:'pointer', fontSize:'0.85rem'
              }}
            >
              ✕ Cerrar
            </button>
          </div>

          {/* Instrucción sutil en la parte baja */}
          {!found && (
            <div style={{
              position:'absolute', bottom:'2rem', left:0, right:0, zIndex:100,
              display:'flex', justifyContent:'center'
            }}>
              <div style={{
                background:'rgba(0,0,0,0.6)', backdropFilter:'blur(10px)',
                border:'1px solid #374151', padding:'8px 20px', borderRadius:'50px',
                fontSize:'0.85rem', color:'#d1d5db'
              }}>
                Apunta la cámara a la etiqueta de la cerveza 🍺
              </div>
            </div>
          )}

          <ARViewer
            targetSrc="/targets.mind"
            onTargetFound={() => setFound(true)}
            onTargetLost={() => setFound(false)}
          >
            {/* Anillo giratorio alrededor de la etiqueta */}
            {/* @ts-ignore */}
            <a-ring
              color="#fbbf24"
              radius-inner="0.55"
              radius-outer="0.7"
              position="0 0 0.01"
              rotation="-90 0 0"
              material="side: double; opacity: 0.85"
              animation="property: rotation; to: -90 360 0; loop: true; dur: 4000; easing: linear"
            />
            {/* @ts-ignore */}
            <a-ring
              color="#f97316"
              radius-inner="0.75"
              radius-outer="0.82"
              position="0 0 0.01"
              rotation="-90 0 0"
              material="side: double; opacity: 0.5"
              animation="property: rotation; to: -90 -360 0; loop: true; dur: 7000; easing: linear"
            />
            {/* Partícula central flotando */}
            {/* @ts-ignore */}
            <a-sphere
              color="#fbbf24"
              radius="0.06"
              position="0 0 0.1"
              material="opacity: 0.9"
              animation="property: position; to: 0 0 0.25; dir: alternate; loop: true; dur: 1500; easing: easeInOutSine"
            />
            {/* Texto flotando arriba */}
            {/* @ts-ignore */}
            <a-text
              value="BIRRAPP 🍺"
              color="#fbbf24"
              align="center"
              position="0 0.65 0"
              scale="0.5 0.5 0.5"
              animation="property: position; to: 0 0.75 0; dir: alternate; loop: true; dur: 2000; easing: easeInOutSine"
            />
          </ARViewer>
        </>
      )}
    </div>
  );
}
