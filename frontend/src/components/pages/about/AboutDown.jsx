// import React from "react";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/pagination";

// const teamMembers = [
//   {
//     name: "Tom Cruise",
//     role: "Founder & Chairman",
//     image: "/images/tom-cruise.png",
//   },
//   {
//     name: "Emma Watson",
//     role: "Managing Director",
//     image: "/images/emma-watson.png",
//   },
//   {
//     name: "Will Smith",
//     role: "Product Designer",
//     image: "/images/will-smith.png",
//   },
//   {
//     name: "Robert Downey",
//     role: "CEO",
//     image: "/images/robert.png",
//   },
// ];

// const features = [
//   {
//     icon: "🚚",
//     title: "FREE AND FAST DELIVERY",
//     description: "Free delivery for all orders over $140",
//   },
//   {
//     icon: "🎧",
//     title: "24/7 CUSTOMER SERVICE",
//     description: "Friendly 24/7 customer support",
//   },
//   {
//     icon: "🛡",
//     title: "MONEY BACK GUARANTEE",
//     description: "We return money within 30 days",
//   },
// ];

// export default function TeamSection() {
//   return (
//     <section className="w-full bg-white py-16">

//       {/* =========================
//           FIRST SECTION - SWIPER
//       ========================== */}
//       <div className="mx-auto max-w-6xl px-5">

//         <Swiper
//           modules={[Pagination]}
//           pagination={{
//             clickable: true,
//           }}
//           spaceBetween={12}
//           slidesPerView={3}
//           breakpoints={{
//             0: {
//               slidesPerView: 1,
//             },
//             640: {
//               slidesPerView: 2,
//             },
//             1024: {
//               slidesPerView: 3,
//             },
//           }}
//           className="team-swiper pb-10"
//         >

//           {teamMembers.map((member, index) => (
//             <SwiperSlide key={index}>

//               <div className="mx-auto max-w-[145px]">

//                 {/* Image */}
//                 <div className="h-[165px] w-full overflow-hidden bg-gray-100">
//                   <img
//                     src={member.image}
//                     alt={member.name}
//                     className="h-full w-full object-cover"
//                   />
//                 </div>

//                 {/* Name */}
//                 <h3 className="mt-3 text-[14px] font-medium text-gray-900">
//                   {member.name}
//                 </h3>

//                 {/* Position */}
//                 <p className="mt-1 text-[8px] text-gray-500">
//                   {member.role}
//                 </p>

//                 {/* Social Icons */}
//                 <div className="mt-2 flex gap-2 text-[10px] text-gray-700">
//                   <span>♡</span>
//                   <span>◎</span>
//                   <span>in</span>
//                 </div>

//               </div>

//             </SwiperSlide>
//           ))}

//         </Swiper>
//       </div>


//       {/* =========================
//           SECOND SECTION - MANUAL
//       ========================== */}

//       <div className="mx-auto mt-12 max-w-6xl px-5">

//         <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">

//           {features.map((feature, index) => (
//             <div
//               key={index}
//               className="flex flex-col items-center text-center"
//             >

//               {/* Icon Circle */}
//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
//                 <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm">
//                   {feature.icon}
//                 </div>
//               </div>

//               {/* Title */}
//               <h3 className="mt-5 text-[10px] font-bold text-gray-900">
//                 {feature.title}
//               </h3>

//               {/* Description */}
//               <p className="mt-2 text-[8px] text-gray-500">
//                 {feature.description}
//               </p>

//             </div>
//           ))}

//         </div>

//       </div>

//     </section>
//   );
// }