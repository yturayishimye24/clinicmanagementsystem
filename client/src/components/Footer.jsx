import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="bg-white text-gray-700 w-full mt-20 py-12 b border-t-gray-500 border-t-1">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10">
            <div className="md:w-1/3">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Clinic Workspace
              </h2>
              <p className="text-gray-600">
                Clinic Workspace is a platform designed to streamline patient
                management, improve communication between staff and patients,
                and ensure every patient feels understood and cared for.
              </p>
            </div>

            <div className="md:w-1/3">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Quick Links
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>Home</li>
                <li>Services</li>
                <li>FAQs</li>
                <li>Team</li>
              </ul>
            </div>

            <div className="md:w-1/3">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Contact Us
              </h3>
              <p className="text-gray-600">Email: info@clinicworkspace.com</p>
              <p className="text-gray-600">Phone: +1 234 567 890</p>
              <p className="text-gray-600">
                Address: 123 Main Street, Your City
              </p>
            </div>
          </div>

          <div className="border-t border-gray-300 mt-10"></div>

          <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} Clinic Workspace. All rights
              reserved.
            </p>
            <p className="mt-2 md:mt-0">Programmed by Turayishimye</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
