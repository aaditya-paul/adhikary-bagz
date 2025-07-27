import React from "react";

const LuxuryStatement = () => {
  return (
    <section className="font-babas-neue bg-black text-white py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight">
              Crafted for the
              <span className="block text-gray-400">Modern Nomad</span>
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              Each NÓMADA piece is meticulously handcrafted using the finest
              materials sourced from around the globe. From Italian leather to
              Japanese hardware, we believe luxury lies in the details.
            </p>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-light text-white mb-2">100%</div>
                <div className="text-sm text-gray-400">Handcrafted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-white mb-2">50+</div>
                <div className="text-sm text-gray-400">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-white mb-2">∞</div>
                <div className="text-sm text-gray-400">Lifetime Quality</div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <blockquote className="text-2xl md:text-3xl font-light italic text-gray-300 leading-relaxed">
              "Luxury is not about price, it's about the story each piece
              carries and the memories it will create."
            </blockquote>
            <div className="mt-6 w-16 h-0.5 bg-gray-600 mx-auto"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LuxuryStatement;
