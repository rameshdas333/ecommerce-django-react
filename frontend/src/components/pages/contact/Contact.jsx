import React from "react";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="min-h-screen bg-white pt-8 sm:pt-10 md:pt-16 lg:pt-20">

      {/* Main Container */}
      <div className="mx-auto w-[92%] sm:w-[90%] md:w-[86%] lg:w-[82%] w-full">

        {/* Contact Section */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[240px_1fr]">

          {/* ================= LEFT SIDE ================= */}
          <div
            className="
              
              bg-white
              shadow-lg
              px-5 py-6
              sm:px-6 sm:py-7
          
            "
          >

            {/* Call To Us */}
            <div>

              <div className="mb-4 flex items-center gap-3">

                {/* Icon */}
                <div
                  className="
                    flex h-8 w-8
                    shrink-0
                    items-center justify-center
                    rounded-full
                    bg-[#DB4144]
                    text-white
                  "
                >
                  <FaPhoneAlt className="text-[12px]" />
                </div>

                <h3 className="text-sm font-semibold">
                  Call To Us
                </h3>

              </div>

              <p className="mb-3 text-xs leading-5 text-gray-900">
                We are available 24/7, 7 days a week.
              </p>

              <p className="text-xs leading-5 text-gray-900 break-words">
                Phone: +880161112222
              </p>

            </div>


            {/* Divider */}
            <div className="my-5 h-px w-full bg-gray-300"></div>


            {/* Write To Us */}
            <div>

              <div className="mb-4 flex items-center gap-3">

                {/* Icon */}
                <div
                  className="
                    flex h-8 w-8
                    shrink-0
                    items-center justify-center
                    rounded-full
                    bg-[#DB4144]
                    text-white
                  "
                >
                  <FaEnvelope className="text-[13px]" />
                </div>

                <h3 className="text-sm font-semibold">
                  Write To Us
                </h3>

              </div>

              <p className="mb-3 text-xs leading-5">
                Fill out our form and we will contact
                you within 24 hours.
              </p>

              <p className="mb-3 break-all text-xs leading-5">
                Emails: customer@exclusive.com
              </p>

              <p className="break-all text-xs leading-5">
                Emails: support@exclusive.com
              </p>

            </div>

          </div>


          {/* ================= RIGHT SIDE ================= */}
          <div
            className="
              bg-white
              px-4 py-6
              sm:px-6 sm:py-7
              shadow-lg
            "
          >

            <form>

              {/* Input Row */}
              <div
                className="
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-2
                  md:grid-cols-3
                "
              >

                {/* Name */}
                <input
                  type="text"
                  placeholder="Your Name *"
                  required
                  className="
                    h-10
                    w-full
                    rounded-sm
                    border-0
                    bg-[#F5F5F5]
                    px-3
                    text-xs
                    outline-none
                    placeholder:text-gray-500
                    focus:ring-1
                    focus:ring-[#DB4144]
                  "
                />

                {/* Email */}
                <input
                  type="email"
                  placeholder="Your Email *"
                  required
                  className="
                    h-10
                    w-full
                    rounded-sm
                    border-0
                    bg-[#F5F5F5]
                    px-3
                    text-xs
                    outline-none
                    placeholder:text-gray-500
                    focus:ring-1
                    focus:ring-[#DB4144]
                  "
                />

                {/* Phone */}
                <input
                  type="text"
                  placeholder="Your Phone *"
                  required
                  className="
                    h-10
                    w-full
                    rounded-sm
                    border-0
                    bg-[#F5F5F5]
                    px-3
                    text-xs
                    outline-none
                    placeholder:text-gray-500
                    focus:ring-1
                    focus:ring-[#DB4144]
                  "
                />

              </div>


              {/* Message */}
              <textarea
                placeholder="Your Message"
                className="
                  mt-5
                  h-40
                  sm:h-44
                  md:h-48
                  w-full
                  resize-none
                  rounded-sm
                  border-0
                  bg-[#F5F5F5]
                  px-3 py-3
                  text-xs
                  outline-none
                  placeholder:text-gray-500
                  focus:ring-1
                  focus:ring-[#DB4144]
                "
              ></textarea>


              {/* Button */}
              <div
                className="
                  mt-5
                  flex
                  justify-end
                  sm:justify-end
                "
              >

                <button
                  type="submit"
                  className="
                    h-10
                    w-full
                    sm:w-[150px]
                    rounded-sm
                    bg-[#DB4144]
                    text-xs
                    text-white
                    transition
                    duration-300
                    hover:bg-[#C83235]
                  "
                >
                  Send Message
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Contact;