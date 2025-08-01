import React from "react";
import CardStack from "./CardStack";
import TypewriterEffect from "./TypewritterEffect";

const OurServices = () => {
  return (
    <>
      <div className=" w-full flex items-center justify-center pb-50">
        <div className="container w-full  flex flex-col md:flex-row items-center justify-center gap-10">
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl font-bold mb-4">
              Our Services <TypewriterEffect />
            </h1>
            <p className="text-gray-600 pr-20">
              Start your day with comfort using our reliable morning bus
              services, perfect for early travelers. Whether you're commuting
              for work, travel, or leisure, we ensure timely departures and a
              smooth journey. Experience hassle-free transportation with clean,
              safe, and punctual buses every time. Your ride, your time — we’re
              here morning to night.
            </p>
          </div>
          <div className="w-full md:w-1/2 pl-4 pr-4">
            <CardStack />
          </div>
        </div>
      </div>
    </>
  );
};

export default OurServices;
