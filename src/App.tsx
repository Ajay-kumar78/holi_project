import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Palette, Sparkles, Send, RefreshCw, Info, Heart, Share2, AlertTriangle, Phone, Mail, MessageCircle, ArrowRight, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { cn } from './lib/utils';

// --- Components ---

const ColorSplash = ({ color, x, y }: { color: string; x: number; y: number }) => (
  <motion.div
    initial={{ scale: 0, opacity: 1 }}
    animate={{ scale: [1, 2], opacity: 0 }}
    transition={{ duration: 1, ease: "easeOut" }}
    className="absolute pointer-events-none rounded-full blur-3xl"
    style={{
      backgroundColor: color,
      left: x,
      top: y,
      width: '150px',
      height: '150px',
      transform: 'translate(-50%, -50%)',
    }}
  />
);

const SectionHeading = ({ children, className, subtitle }: { children: React.ReactNode; className?: string; subtitle?: string }) => (
  <div className="mb-8 md:mb-16">
    {subtitle && <span className="text-pink-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.5em] mb-3 md:mb-4 block">{subtitle}</span>}
    <h2 className={cn("text-4xl md:text-6xl lg:text-8xl font-display leading-none tracking-tighter", className)}>
      {children}
    </h2>
  </div>
);

export default function App() {
  const [splashes, setSplashes] = useState<{ id: number; color: string; x: number; y: number }[]>([]);
  const [wish, setWish] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'holika' | 'dhulandi'>('holika');
  const [error, setError] = useState<string | null>(null);

  const colors = ['#FF1493', '#00FF00', '#FFD700', '#FF4500', '#8A2BE2', '#00CED1'];

  const handleCanvasClick = (e: React.MouseEvent) => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const newSplash = {
      id: Date.now(),
      color,
      x: e.clientX,
      y: e.clientY,
    };
    setSplashes((prev) => [...prev, newSplash]);
    setTimeout(() => {
      setSplashes((prev) => prev.filter((s) => s.id !== newSplash.id));
    }, 1200);

    confetti({
      particleCount: 40,
      spread: 80,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: [color],
      ticks: 200,
    });
  };

  const generateWish = async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      setError("API Key Required for AI Generation.");
      setWish("May your life be filled with the colors of joy and the warmth of the bonfire. Happy Holi! (Connect an API key for unique AI wishes)");
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Write a short, poetic, and joyful Holi wish for 2026. Include mentions of Holika Dahan's purity and Dhulandi's vibrant colors. Keep it under 50 words.",
      });
      setWish(response.text || "Wishing you a vibrant and joyful Holi!");
    } catch (err) {
      console.error("Error generating wish:", err);
      setError("Failed to generate wish.");
      setWish("May your life be filled with the colors of joy and the warmth of the bonfire. Happy Holi!");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans bg-[#050505]" onClick={handleCanvasClick}>
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-[60%] h-[60%] bg-pink-600/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[60%] h-[60%] bg-orange-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Interactive Splashes */}
      <AnimatePresence>
        {splashes.map((s) => (
          <ColorSplash key={s.id} {...s} />
        ))}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 p-4 md:p-6 flex justify-between items-center mix-blend-difference">
        <div className="font-display text-xl md:text-2xl tracking-tighter">HOLI'26</div>
        <div className="hidden md:flex gap-8 font-mono text-xs uppercase tracking-widest">
          <button onClick={() => document.getElementById('traditions')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-pink-500 transition-colors">Traditions</button>
          <button onClick={() => document.getElementById('ai-wishes')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-orange-500 transition-colors">AI Wishes</button>
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-green-500 transition-colors">Contact</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 z-10">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="absolute -top-10 md:-top-20 left-1/2 -translate-x-1/2 w-full text-stroke text-5xl md:text-8xl lg:text-[12rem] font-display opacity-10 select-none">
            FESTIVAL
          </div>
          <h1 className="text-6xl sm:text-8xl md:text-[10rem] lg:text-[15rem] font-display leading-[0.8] tracking-tighter mb-4">
            HOLI<span className="text-pink-600">.</span>
          </h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col items-center"
          >
            <div className="h-px w-16 md:w-24 bg-white/20 mb-4 md:mb-6" />
            <p className="text-pink-500 font-mono text-[10px] md:text-sm uppercase tracking-[0.3em] md:tracking-[0.4em] font-bold mb-2 px-2">
              Ajay Kumar wishes all his followers
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-serif italic text-white/80 px-4">
              A very Happy Holi 2026
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-12 md:mt-16 flex flex-col sm:flex-row gap-4 md:gap-6 w-full max-w-md sm:max-w-none px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById('traditions')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 md:px-10 py-4 md:py-5 bg-white text-black rounded-full font-bold hover:scale-105 transition-all flex items-center justify-center gap-3 group text-sm md:text-base"
          >
            EXPLORE TRADITIONS <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              generateWish();
            }}
            className="px-6 md:px-10 py-4 md:py-5 glass text-white rounded-full font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-sm md:text-base"
          >
            GET AI WISH <Sparkles size={18} className="text-pink-500" />
          </button>
        </motion.div>

        <div className="absolute bottom-10 left-10 hidden lg:block">
          <div className="font-mono text-[10px] text-white/40 uppercase tracking-[0.5em] vertical-text">
            SCROLL TO EXPLORE
          </div>
        </div>
      </section>

      {/* Traditions Section */}
      <section id="traditions" className="relative py-16 md:py-32 px-4 md:px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <SectionHeading subtitle="The Essence of Celebration">Traditions</SectionHeading>
          
          <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center mb-16 md:mb-32">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden glass p-2 md:p-4">
                <div className="w-full h-full rounded-xl md:rounded-2xl overflow-hidden relative group">
                  <img 
                    src="/image/holika.jpg" 
                    alt="Holika Dahan" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8">
                    <div className="flex items-center gap-2 md:gap-3 text-orange-500 mb-1 md:mb-2">
                      <Flame size={20} className="md:w-6 md:h-6" />
                      <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest">Sacred Fire</span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-display">HOLIKA DAHAN</h3>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 md:-top-10 -right-6 md:-right-10 w-24 h-24 md:w-40 md:h-40 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
            </motion.div>
            
            <div className="space-y-6 md:space-y-8">
              <p className="text-xl md:text-3xl lg:text-4xl font-serif italic text-white/60 leading-tight">
                "The night of purification, where the old is consumed by flames to make way for the new."
              </p>
              <div className="h-px w-full bg-white/10" />
              <p className="text-base md:text-lg text-white/40 leading-relaxed">
                Holika Dahan commemorates the victory of Prahlad's devotion over the demoness Holika. It is a time for the community to gather, pray, and burn away negativity.
              </p>
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {['Victory of Good', 'Purification', 'Community', 'Sacred Ash'].map((item) => (
                  <div key={item} className="flex items-center gap-2 md:gap-3 text-white/60 font-mono text-[10px] md:text-xs uppercase tracking-widest">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-orange-500 rounded-full" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
            <div className="order-2 lg:order-1 space-y-6 md:space-y-8">
              <p className="text-xl md:text-3xl lg:text-4xl font-serif italic text-white/60 leading-tight">
                "A canvas of joy where every splash tells a story of love and friendship."
              </p>
              <div className="h-px w-full bg-white/10" />
              <p className="text-base md:text-lg text-white/40 leading-relaxed">
                Dhulandi is the explosion of life. People play with Gulal and water, breaking all barriers of age, status, and background to celebrate the arrival of spring.
              </p>
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {['Vibrant Gulal', 'Spring Arrival', 'Equality', 'Sweet Gujiya'].map((item) => (
                  <div key={item} className="flex items-center gap-2 md:gap-3 text-white/60 font-mono text-[10px] md:text-xs uppercase tracking-widest">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-pink-500 rounded-full" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 relative"
            >
              <div className="aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden glass p-2 md:p-4">
                <div className="w-full h-full rounded-xl md:rounded-2xl overflow-hidden relative group">
                  <img 
                    src="/image/dhulandi.jpg" 
                    alt="Dhulandi" 
                    className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8">
                    <div className="flex items-center gap-2 md:gap-3 text-pink-500 mb-1 md:mb-2">
                      <Palette size={20} className="md:w-6 md:h-6" />
                      <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest">Play of Hues</span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-display">DHULANDI</h3>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 md:-bottom-10 -left-6 md:-left-10 w-24 h-24 md:w-40 md:h-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Wishes Section */}
      <section id="ai-wishes" className="relative py-16 md:py-32 px-4 md:px-6 z-10 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <SectionHeading subtitle="Personalized Celebration" className="text-center">AI Wishes</SectionHeading>
          
          <div className="glass rounded-3xl md:rounded-[4rem] p-6 md:p-12 lg:p-20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-pink-500/5 rounded-full blur-[100px] group-hover:bg-pink-500/10 transition-all" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="min-h-[200px] md:min-h-[250px] w-full flex flex-col items-center justify-center text-center">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-4 md:gap-6">
                    <div className="relative">
                      <RefreshCw className="animate-spin text-pink-500" size={48} />
                      <Sparkles className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-orange-500 animate-pulse" size={20} />
                    </div>
                    <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.5em] text-white/40">Synthesizing Joy...</p>
                  </div>
                ) : wish ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 md:space-y-8"
                  >
                    <div className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-serif italic text-white/90 leading-tight max-w-3xl mx-auto px-2">
                      <Markdown>{wish}</Markdown>
                    </div>
                    
                    {error && (
                      <div className="p-3 md:p-4 bg-red-500/10 border border-red-500/20 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3 text-red-400 text-[10px] md:text-xs font-mono uppercase tracking-widest mx-auto max-w-xs">
                        <AlertTriangle size={14} className="md:w-4 md:h-4" />
                        {error}
                      </div>
                    )}

                    <div className="flex justify-center gap-3 md:gap-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(wish);
                          alert("Wish copied to clipboard!");
                        }}
                        className="p-3 md:p-4 glass rounded-full hover:bg-white/10 transition-all text-white/60 hover:text-white"
                      >
                        <Send size={20} className="md:w-6 md:h-6" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          generateWish();
                        }}
                        className="p-3 md:p-4 glass rounded-full hover:bg-white/10 transition-all text-white/60 hover:text-white"
                      >
                        <RefreshCw size={20} className="md:w-6 md:h-6" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      generateWish();
                    }}
                    className="group flex flex-col items-center gap-6 md:gap-8"
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-all duration-500">
                      <Sparkles size={32} className="md:w-10 md:h-10" />
                    </div>
                    <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.5em] md:tracking-[0.8em] text-white/40 group-hover:text-white transition-colors">Initialize Generation</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-16 md:py-32 px-4 md:px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <SectionHeading subtitle="Get in Touch">Connection</SectionHeading>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <a href="tel:9216594325" className="glass p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] group hover:bg-orange-500/10 transition-all">
              <Phone className="text-orange-500 mb-4 md:mb-6 group-hover:scale-110 transition-transform" size={28} />
              <div className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-white/40 mb-2">Voice</div>
              <div className="text-xl md:text-2xl font-bold tracking-tighter">9216594325</div>
            </a>
            <a href="https://wa.me/9216594325" target="_blank" rel="noopener noreferrer" className="glass p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] group hover:bg-green-500/10 transition-all">
              <MessageCircle className="text-green-500 mb-4 md:mb-6 group-hover:scale-110 transition-transform" size={28} />
              <div className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-white/40 mb-2">WhatsApp</div>
              <div className="text-xl md:text-2xl font-bold tracking-tighter">Connect Now</div>
            </a>
            <a href="mailto:akswami9521@gmail.com" className="glass p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] group hover:bg-indigo-500/10 transition-all sm:col-span-2 md:col-span-1">
              <Mail className="text-indigo-500 mb-4 md:mb-6 group-hover:scale-110 transition-transform" size={28} />
              <div className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-white/40 mb-2">Email</div>
              <div className="text-xl md:text-2xl font-bold tracking-tighter break-all">akswami9521@gmail.com</div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 md:py-20 px-4 md:px-6 z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
          <div className="text-center md:text-left">
            <div className="font-display text-3xl md:text-4xl mb-2 tracking-tighter">HOLI'26</div>
            <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em]">Created by Ajay Kumar</p>
          </div>
          
          <div className="flex gap-6 md:gap-8 text-white/20">
            <button className="hover:text-pink-500 transition-colors"><Share2 size={20} className="md:w-6 md:h-6" /></button>
            <button className="hover:text-orange-500 transition-colors"><Flame size={20} className="md:w-6 md:h-6" /></button>
            <button className="hover:text-green-500 transition-colors"><Palette size={20} className="md:w-6 md:h-6" /></button>
          </div>

          <div className="text-center md:text-right">
            <div className="font-mono text-[10px] text-white/40 uppercase tracking-[0.3em] md:tracking-[0.5em] mb-2">System Status</div>
            <div className="flex items-center justify-center md:justify-end gap-2 text-green-500 font-mono text-[10px] uppercase tracking-widest">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Operational
            </div>
          </div>
        </div>
        
        <div className="mt-12 md:mt-20 text-center overflow-hidden">
          <div className="text-[6rem] sm:text-[10rem] md:text-[15rem] lg:text-[20rem] font-display text-white/[0.02] leading-none select-none">
            AJAY
          </div>
        </div>
      </footer>

      {/* Mobile Splash FAB */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            confetti({
              particleCount: 150,
              spread: 100,
              origin: { y: 0.8 }
            });
          }}
          className="w-14 h-14 bg-white text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
        >
          <Palette size={24} />
        </button>
      </div>
    </div>
  );
}
