import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const FAQ_DATA = [
  {
    id: 1,
    category: "Weddings",
    question: "Why should we choose you?",
    answer: "We treat every wedding as a timeless cinematic masterpiece. With over 8 years of experience capturing elite celebrations across 14 countries, our editorial approach blends authentic documentative moments with fine-art portraiture. We don't just take photographs; we craft legacy family heirlooms that evoke emotion for generations."
  },
  {
    id: 2,
    category: "Weddings",
    question: "How is your work different from others?",
    answer: "Our signature aesthetic balances painterly natural lighting with candid emotional depth. Unlike traditional photography teams that construct stiff poses, we work unobtrusively, capturing raw, organic interactions while offering discreet artistic direction during portraits to ensure you look effortlessly luminous."
  },
  {
    id: 3,
    category: "Logistics",
    question: "Do you cover destination weddings?",
    answer: "Absolutely. Over 60% of our annual commissions take place outside our home region—from Italian villas and French châteaux to coastal Mexican estates. We manage all travel, logistical planning, and equipment transportation seamlessly, requiring zero stress on your end."
  },
  {
    id: 4,
    category: "Logistics",
    question: "How many people will come for my wedding?",
    answer: "Our team scale is carefully tailored to your celebration's scope and guest list. A standard multi-day luxury wedding typically features 2 lead photographers, 2 cinematic cinematographers, and 1 dedicated drone operator/assistant to ensure every perspective is captured without feeling intrusive."
  },
  {
    id: 5,
    category: "Pricing",
    question: "How are your services priced?",
    answer: "Every wedding is unique. Our custom collections begin at $6,500 for single-day local celebrations and scale depending on travel scope, multi-day itineraries, custom-bound fine art albums, and drone cinematography. Contact us directly for a bespoke quote tailored precisely to your timeline."
  },
  {
    id: 6,
    category: "Logistics",
    question: "What are your delivery timelines?",
    answer: "You will receive a curated 'Sneak Peek' gallery of 40–60 fully edited high-resolution images within 72 hours of your wedding day to share with loved ones. Your complete online gallery and cinematic film trailer are delivered within 6 to 8 weeks."
  }
];

export default function FAQAccordion() {
  const [openId, setOpenId] = useState(null);

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white text-[#2C2723] font-serif transition-colors duration-300">
      {/* Google Fonts Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500;1,600&family=Plus+Jakarta+Sans:wght@300;400;500&display=swap');
        
        .font-serif {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        .font-sans {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .custom-underline {
          position: relative;
          display: inline-block;
        }
        .custom-underline::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 2px;
          width: 100%;
          height: 1.2px;
          background: currentColor;
          opacity: 0.5;
        }
      `}</style>

      {/* Main Content Section */}
      <main className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        {/* Title Header */}
        <header className="text-center mb-16 md:mb-24">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-[#2C2723]">
            Confused?{" "}
            <span className="italic text-[#6E5F3B] font-normal custom-underline">
              We’ve Got the Answers!
            </span>
          </h1>
        </header>

        {/* Accordion Container */}
        <div className="border-t border-b border-[#6E5F3B] divide-y divide-[#6E5F3B]">
          {FAQ_DATA.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div key={item.id} className="group">
                {/* Accordion Header / Question Button */}
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full py-6 md:py-7 px-2 text-left flex justify-between items-center space-x-6 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-xl md:text-2xl lg:text-[1.7rem] font-normal tracking-tight text-[#2C2723] group-hover:translate-x-1.5 transition-transform duration-300">
                    {item.question}
                  </span>

                  {/* Plus / Rotate Icon Container */}
                  <div className="flex-shrink-0 flex items-center justify-center">
                    <span
                      className={`inline-flex items-center justify-center transition-transform duration-500 ease-in-out ${
                        isOpen ? 'rotate-45' : 'rotate-0'
                      }`}
                    >
                      <Plus className="w-6 h-6 stroke-[1.2] text-[#2C2723]" />
                    </span>
                  </div>
                </button>

                {/* Collapsible Answer Block */}
                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100 pb-7 px-2'
                      : 'grid-rows-[0fr] opacity-0 pb-0 px-2'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="font-sans font-light text-sm md:text-base leading-relaxed text-[#5C554E] max-w-2xl">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}