
import React from "react";
import BlueCench from "../../images/BlueCench.png";
import RedCench from "../../images/RedCench.jpeg";
import patients from "../../images/patients.png";
import {forwardRef} from "react"

const   TeamSection= forwardRef((props,ref)=>{
  const teamMembers = [
    {
      image: BlueCench,
      name: "Dr. Alice Blue",
      title: "Chief Physician",
      bio: "Expert in internal medicine with over 15 years of experience. Committed to compassionate, patient-centered care.",
    },
    {
      image: RedCench,
      name: "Dr. Robert Red",
      title: "Surgeon & Specialist",
      bio: "Board-certified surgeon specializing in minimally invasive procedures and complex cases.",
    },
    {
      image: patients,
      name: "Nurse Jane Patients",
      title: "Senior Nurse",
      bio: "Dedicated registered nurse focused on patient comfort, education, and post-treatment care.",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-16" ref={ref}>
      <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-32 h-32 object-cover rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold">{member.name}</h3>
            <p className="text-green-700 font-medium mb-2">{member.title}</p>
            <p className="text-gray-600">{member.bio}</p>
          </div>
        ))}
      </div>
    </section>
  );
});

export default TeamSection;
