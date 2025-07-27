import Image from "next/image";
import React from "react";

const Icon = ({ source }) => {
  return <Image src={source} alt="Cart Icon" className="w-6 h-6" />;
};

export default Icon;
