import React, { useState, forwardRef } from "react";
import { Plus, Minus } from "lucide-react";

const Faqs = forwardRef((props, ref) => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      q: "HOW CAN I REACH OUT TO THE NURSE? WHEN ARE THEY AVAILABLE?",
      a: "You can contact the nurse using the clinic hotline or book an appointment online."
    },
    {
      q: "HOW DO I BOOK AN APPOINTMENT?",
      a: "Appointments can be booked through our website or at the clinic front desk."
    },
    {
      q: "WHAT ARE THE WORKING HOURS?",
      a: "Our team is available from 8:00 AM to 6:00 PM, Monday to Saturday."
    },
    {
      q: "CAN I CHANGE MY APPOINTMENT?",
      a: "Yes, appointment changes are allowed up to 12 hours before your scheduled time."
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen text-center font-arial" ref={ref}>
      <h1 className="text-gray-400 text-3xl mb-5">FAQs</h1>
      <h1 className="text-gray-500 text-2xl mb-5">SERVICE INFO</h1>

      <div className="w-[700px] mx-auto space-y-3">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="border-t-4 border-gray-400 bg-white shadow shadow-gray-400"
          >
            <div
              className="flex items-center justify-between p-5 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <h2 className="text-left w-[80%]">{item.q}</h2>

              {openIndex === index ? (
                <Minus className="text-green-600" />
              ) : (
                <Plus className="text-green-600" />
              )}
            </div>

            <div
              className={`transition-all duration-300 overflow-hidden ${
                openIndex === index ? "max-h-40 p-5" : "max-h-0"
              }`}
            >
              <p className="text-gray-600 text-left">{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default Faqs;
