'use client';
import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';

export default function ProjectDetail({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef(null);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      const json = await res.json();
      if (json.success) setProject(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handlePhotoUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert to Base64 and compress slightly
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // JPEG format, 0.7 quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

        try {
          const body = {};
          if (type === 'before') body.photoBefore = dataUrl;
          if (type === 'after') body.photoAfter = dataUrl;

          const res = await fetch(`/api/projects/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          const json = await res.json();
          if (json.success) setProject(json.data);
        } catch (err) {
          console.error('Error uploading', err);
        }
      };
    };
  };

  const handleMouseMove = (e) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  if (loading) return <div className="container"><p>Cargando proyecto...</p></div>;
  if (!project) return <div className="container"><p>Proyecto no encontrado.</p></div>;

  return (
    <div className="container">
      <div className="nav-bar" style={{ marginBottom: '2rem' }}>
        <Link href="/" className="btn btn-outline">← Volver al Dashboard</Link>
      </div>

      <header className="header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{project.beneficiaryName}</h1>
          <p style={{ opacity: 0.9 }}>📍 {project.address}</p>
        </div>
        <span className={`status-badge status-${project.status.toLowerCase().replace(' ', '')}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
          {project.status}
        </span>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Registro Fotográfico: Antes</h2>
          {project.photoBefore ? (
            <div style={{ position: 'relative' }}>
               <img src={project.photoBefore} alt="Antes" className="photo-preview" />
               <label className="btn btn-secondary" style={{ position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 10 }}>
                 Cambiar
                 <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload(e, 'before')} />
               </label>
            </div>
          ) : (
            <label className="photo-upload-zone" style={{ display: 'block' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏚️</div>
              <p>Haz clic para subir la foto inicial del estado de la vivienda.</p>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload(e, 'before')} />
            </label>
          )}
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Registro Fotográfico: Después</h2>
          {project.photoAfter ? (
            <div style={{ position: 'relative' }}>
               <img src={project.photoAfter} alt="Después" className="photo-preview" />
               <label className="btn btn-primary" style={{ position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 10 }}>
                 Cambiar
                 <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload(e, 'after')} />
               </label>
            </div>
          ) : (
            <label className="photo-upload-zone" style={{ display: 'block' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</div>
              <p>Haz clic para subir la foto final después del mejoramiento.</p>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload(e, 'after')} />
            </label>
          )}
        </div>
      </div>

      {project.photoBefore && project.photoAfter && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Comparativo Antes y Después</h2>
          
          <div 
            className="comparison-slider" 
            ref={sliderRef}
            onMouseMove={handleMouseMove}
            onTouchMove={(e) => handleMouseMove(e.touches[0])}
          >
            {/* Base image is After */}
            <img src={project.photoAfter} alt="Después" />
            <span className="badge-label badge-right">Después</span>
            
            {/* Clipped image is Before */}
            <div className="comparison-clip" style={{ width: `${sliderPosition}%` }}>
              <img src={project.photoBefore} alt="Antes" />
              <span className="badge-label badge-left">Antes</span>
            </div>
            
            {/* Draggable handle */}
            <div className="comparison-handle" style={{ left: `${sliderPosition}%` }} />
          </div>
          <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--color-text-muted)' }}>Desliza para comparar el impacto del mejoramiento.</p>
        </div>
      )}
    </div>
  );
}
