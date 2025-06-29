import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Blog {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  featured: boolean;
  views?: number;
}

export default function Home() {
  const [featured, setFeatured] = useState<Blog[]>([]);
  const [mostViewed, setMostViewed] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderImages = [
    { src: '/gezi.avif', alt: 'Gezi' },
    { src: '/resim1.jpg', alt: 'Resim 1' },
    { src: '/resim2.jpeg', alt: 'Resim 2' }
  ];

  useEffect(() => {
    fetch('/api/blogs?featured=1').then(r => r.json()).then(setFeatured);
    fetch('/api/blogs?mostViewed=1').then(r => r.json()).then(setMostViewed);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  return (
    <main style={{ minHeight: '100vh', background: '#fafafa', padding: '2rem 0' }}>
      {/* Büyük Başlık ve Açıklama */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2.5rem',
      }}>
        <div style={{
          fontSize: '2.8rem',
          fontWeight: 800,
          color: '#222',
          marginBottom: '1.2rem',
          letterSpacing: '-1px',
        }}>
          Zeliş'le Rotalar: Yeni yerler, yeni hikâyeler…
        </div>
        <div style={{
          fontSize: '1.25rem',
          color: '#555',
          maxWidth: 600,
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Dünyayı gezenlerin notları burada birleşiyor. Sen de keşfettiklerini paylaş!
        </div>
      </div>

      {/* Slider */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '3rem',
        padding: '0 2rem'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          position: 'relative'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '400px',
            overflow: 'hidden'
          }}>
            {sliderImages.map((image, index) => (
              <img 
                key={index}
                src={image.src} 
                alt={image.alt} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  opacity: index === currentSlide ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out'
                }}
              />
            ))}
            
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              ‹
            </button>
            
            <button
              onClick={nextSlide}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              ›
            </button>
            
            {/* Dots Indicator */}
            <div style={{
              position: 'absolute',
              bottom: '15px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
              zIndex: 10
            }}>
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: 'none',
                    background: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Bölümü */}
      <section style={{ margin: '2rem', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto' }}>
        <h2 style={{ 
          fontSize: '1.8rem', 
          fontWeight: 600, 
          marginBottom: '2rem', 
          color: '#333',
          textAlign: 'center'
        }}>
          En Çok Ziyaret Edilen Yolculuklar
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          padding: '0 1rem'
        }}>
          {mostViewed.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              gridColumn: '1 / -1',
              color: '#666',
              fontSize: '1.1rem'
            }}>
              Henüz blog yazısı bulunmuyor.
            </div>
          )}
          
          {mostViewed.map(blog => (
            <div key={blog.id} style={{ 
              background: '#fff', 
              borderRadius: '12px', 
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid #f0f0f0',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer'
            }} 
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
            }}>
              {/* Blog Görseli */}
              <div style={{
                width: '100%',
                height: '200px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img 
                  src={blog.imageUrl || '/gezi.avif'} 
                  alt={blog.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.currentTarget.src = '/gezi.avif';
                  }}
                />
              </div>
              
              {/* Blog İçeriği */}
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: 600,
                  marginBottom: '1rem',
                  color: '#333',
                  lineHeight: '1.4'
                }}>
                  {blog.title}
                </h3>
                <p style={{ 
                  margin: '0 0 1rem 0', 
                  color: '#666',
                  lineHeight: '1.6',
                  fontSize: '0.95rem'
                }}>
                  {blog.content.slice(0, 150)}...
                </p>
                <div style={{ color: '#f39c12', fontWeight: 600, marginBottom: 8 }}>Okunma: {blog.views || 0}</div>
                <button
                  onClick={() => setSelectedBlog(blog)}
                  style={{
                    background: '#fcb69f',
                    color: '#fff',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 18px',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f39c12')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fcb69f')}
                >
                  Devamını Oku →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Pop-up Modal */}
      {selectedBlog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.45)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => setSelectedBlog(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              maxWidth: 600,
              width: '90vw',
              padding: '2rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBlog(null)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: '#e74c3c',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '6px 14px',
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >Kapat</button>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 16, color: '#1565c0' }}>{selectedBlog.title}</h2>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>Okunma: {selectedBlog.views || 0}</div>
            <div style={{ color: '#333', fontSize: 17, lineHeight: 1.7 }}>{selectedBlog.content}</div>
          </div>
        </div>
      )}
    </main>
  );
}
