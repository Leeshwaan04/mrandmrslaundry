import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplitVideoExperience from './components/SplitVideoExperience';
import CottonJourneyScroll from './components/CottonJourneyScroll';
import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import GalleryPage from './components/GalleryPage';
import ContactPage from './components/ContactPage';
import BookingModal from './components/BookingModal';
import TrackOrderModal from './components/TrackOrderModal';
import OrchestratedEaseReverseDemo from './components/OrchestratedEaseReverseDemo';
import ConciergeIsland from './components/ConciergeIsland';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const audioRef = useRef(null);

  // Sync with browser routing (pathname, hash, or query parameters)
  useEffect(() => {
    const syncRoute = () => {
      // 1. Check hash (e.g. #services, #about, #contact)
      const hash = window.location.hash.replace('#', '').toLowerCase();
      
      // 2. Check pathname (e.g. /services, /about, /contact, /gallery, /track, /book)
      const path = window.location.pathname.replace(/^\/|\/$/g, '').toLowerCase();
      
      // 3. Check query param (e.g. ?p=services or ?/services)
      const searchParams = new URLSearchParams(window.location.search);
      const queryRoute = searchParams.get('p') || searchParams.get('page');

      const target = hash || (path && path !== 'mrandmrslaundry' ? path : '') || queryRoute;

      if (['home', 'about', 'services', 'gallery', 'contact', 'easereverse', 'gsap'].includes(target)) {
        setCurrentPage(target === 'gsap' ? 'easereverse' : target);
      } else if (target === 'track') {
        setIsTrackOrderOpen(true);
      } else if (target === 'book') {
        setIsBookingOpen(true);
      }
    };

    syncRoute();

    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
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
          <>
            <SplitVideoExperience
              onOpenBooking={handleOpenBooking}
              onNavigate={handleNavigate}
            />
            <CottonJourneyScroll />
          </>
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

      {/* Floating VisionOS Concierge Island (WhatsApp & Express Booking) */}
      <ConciergeIsland onOpenFullBooking={handleOpenBooking} />

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
