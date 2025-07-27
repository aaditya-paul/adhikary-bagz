import React from "react";

const BrandProgress = () => {
  const milestones = [
    {
      year: "1973",
      title: "Founded",
      description: "Born from a passion for travel and authentic craftsmanship",
    },
    {
      year: "1985",
      title: "Global Expansion",
      description: "Opened flagship stores in Paris, Milan, and Tokyo",
    },
    {
      year: "2010",
      title: "Sustainable Luxury",
      description:
        "Pioneered eco-conscious materials without compromising quality",
    },
    {
      year: "2024",
      title: "Digital Innovation",
      description: "Launched personalized design experiences for modern nomads",
    },
  ];

  return (
    <section className="font-babas-neue bg-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 sticky top-[60px] z-10 py-4 bg-white">
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-900">
            Five Decades of Excellence
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            From humble beginnings to global recognition, our journey has been
            defined by unwavering commitment to craftsmanship and innovation.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 h-full bg-gray-300 hidden md:block"></div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative">
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                    index % 2 === 0 ? "md:text-right" : "md:text-left"
                  }`}
                >
                  <div
                    className={`${
                      index % 2 === 0 ? "md:order-1" : "md:order-2"
                    }`}
                  >
                    <div className="text-5xl font-light text-gray-900 mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                  <div
                    className={`${
                      index % 2 === 0 ? "md:order-2" : "md:order-1"
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="hidden md:flex justify-center">
                      <div className="w-4 h-4 bg-gray-900 rounded-full border-4 border-white shadow-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="w-32 h-0.5 bg-gray-900 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 font-light italic">
            The journey continues...
          </p>
        </div>
      </div>
    </section>
  );
};

export default BrandProgress;
