import React from "react";
import Link from "next/link";

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: "Handbags",
      link: "/category/handbags",
      description: "Elegant everyday essentials",
    },
    {
      id: 2,
      name: "Backpacks",
      link: "/category/backpacks",
      description: "Urban adventure companions",
    },
    {
      id: 3,
      name: "Crossbody",
      link: "/category/crossbody",
      description: "Hands-free convenience",
    },
    {
      id: 4,
      name: "Totes",
      link: "/category/totes",
      description: "Spacious daily carriers",
    },
    {
      id: 5,
      name: "Clutches",
      link: "/category/clutches",
      description: "Evening sophistication",
    },
    {
      id: 6,
      name: "Travel",
      link: "/category/travel",
      description: "Journey ready designs",
    },
  ];

  return (
    <section className="font-babas-neue px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl text-center mb-12">Shop by Category</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={category.link}>
              <div className="group cursor-pointer">
                <div className="border border-gray-200 rounded-lg p-8 hover:border-gray-400 transition-all duration-300 hover:shadow-sm">
                  <h3 className="text-2xl font-semibold mb-2 group-hover:text-gray-700 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-base">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/categories">
            <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors duration-300 text-lg cursor-pointer">
              View All Categories
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;
