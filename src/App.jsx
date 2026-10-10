import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplitVideoExperience from './components/SplitVideoExperience';
import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import GalleryPage from './components/GalleryPage';
import ContactPage from './components/ContactPage';
import BookingModal from './components/BookingModal';
import TrackOrderModal from './components/TrackOrderModal';
import OrchestratedEaseReverseDemo from './components/OrchestratedEaseReverseDemo';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const audioRef = useRef(null);

  // Sync with browser hash routing (e.g. #about, #services, #gallery, #contact, #easereverse)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['home', 'about', 'services', 'gallery', 'contact', 'easereverse', 'gsap'].includes(hash)) {
        setCurrentPage(hash === 'gsap' ? 'easereverse' : hash);
      } else if (hash === 'track') {
        setIsTrackOrderOpen(true);
      } else if (hash === 'book') {
        setIsBookingOpen(true);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (pageId) => {
    setCurrentPage(pageId);
    window.location.hash = pageId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (data = null) => {
    setBookingData(data);
    setIsBookingOpen(true);
  };

  const handleToggleAudio = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsAudioPlaying(true))
        .catch(() => setIsAudioPlaying(false));
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#f5f5f7',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Global Background Audio (Chill Winston — On My Own) */}
      <audio
        ref={audioRef}
        src="./on-my-own-chill-winston-main-version-49662-02-59.mp3"
        loop
        preload="none"
      />

      {/* Global Persistent Frosted Glass Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking()}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
      />

      {/* Main Page Content View */}
      <main style={{ flex: 1 }}>
        {currentPage === 'home' && (
          <SplitVideoExperience
            onOpenBooking={handleOpenBooking}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'about' && (
          <AboutPage onOpenBooking={handleOpenBooking} />
        )}
        {currentPage === 'services' && (
          <ServicesPage onOpenBooking={handleOpenBooking} />
        )}
        {currentPage === 'gallery' && (
          <GalleryPage onOpenBooking={handleOpenBooking} />
        )}
        {currentPage === 'contact' && (
          <ContactPage onOpenBooking={handleOpenBooking} />
        )}
        {currentPage === 'easereverse' && (
          <OrchestratedEaseReverseDemo
            onOpenBooking={handleOpenBooking}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Global Comprehensive Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking()}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
      />

      {/* Doorstep Booking Concierge Drawer / Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialData={bookingData}
      />

      {/* Real-time Order Tracking Modal */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />
    </div>
  );
}
