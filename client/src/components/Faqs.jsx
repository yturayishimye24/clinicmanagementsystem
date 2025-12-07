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
    <div ref={ref} className="min-h-screen px-4 py-10 font-arial bg-gray-50">
      <h1 className="text-gray-400 text-3xl text-center mb-2 font-bold">FAQs</h1>
      <h2 className="text-gray-500 text-xl text-center mb-8">SERVICE INFO</h2>

      <div className="max-w-[700px] w-full mx-auto space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="border border-gray-300 bg-white rounded-lg shadow-sm transition hover:shadow-md"
          >
            
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center p-5 text-left focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg"
            >
              <span className="font-medium text-gray-800">{item.q}</span>
              {openIndex === index ? (
                <Minus className="text-green-600" />
              ) : (
                <Plus className="text-green-600" />
              )}
            </button>

            
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-40 p-5" : "max-h-0 px-5"
              }`}
            >
              <p className="text-gray-600">{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default Faqs;
