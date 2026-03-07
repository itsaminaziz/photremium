import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './context/LanguageContext';
import { ContactProvider } from './context/ContactContext';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import ContactForm from './Components/ContactForm/ContactForm';
import Home from './Components/Pages/Home';
import About from './Components/Pages/About';
import ImageConverter from './Components/Pages/ImageConverter';
import ImageCompressor from './Components/Pages/ImageCompressor';
import ResizeImage from './Components/Pages/ResizeImage';
import CropImage from './Components/Pages/CropImage';
import RemoveBackground from './Components/Pages/RemoveBackground';
import WatermarkImage from './Components/Pages/WatermarkImage';
import QRCodeGenerator from './Components/Pages/QRCodeGenerator';
import QRCodeScanner from './Components/Pages/QRCodeScanner';
import FaceBlur from './Components/Pages/FaceBlur';
import ScrollToTop from './Components/ScrollToTop';
import './App.css';

/* All page routes — rendered for both "/" and "/:lang/" */
const pageRoutes = (
  <>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="image-converter" element={<ImageConverter />} />
    <Route path="convert/:conversionType" element={<ImageConverter />} />
    <Route path="image-compressor" element={<ImageCompressor />} />
    <Route path="resize-image" element={<ResizeImage />} />
    <Route path="crop-image" element={<CropImage />} />
    <Route path="remove-background" element={<RemoveBackground />} />
    <Route path="watermark-image" element={<WatermarkImage />} />
    <Route path="qr-code-generator" element={<QRCodeGenerator />} />
    <Route path="qr-code-scanner" element={<QRCodeScanner />} />
    <Route path="face-blur" element={<FaceBlur />} />
  </>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <LanguageProvider>
          <ContactProvider>
            <ScrollToTop />
            <div className="App">
              <Navbar />
              <main className="main-content">
                <Routes>
                  {/* English / default — no prefix */}
                  <Route path="/">{pageRoutes}</Route>
                  {/* Language-prefixed routes: /es/*, /ur/*, /fr/*, etc. */}
                  <Route path="/:lang">{pageRoutes}</Route>
                </Routes>
              </main>
              <Footer />
              {/* Global contact popup — rendered once, controlled via ContactContext */}
              <ContactForm mode="popup" />
            </div>
          </ContactProvider>
        </LanguageProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;