"use client";

import MomentCard from "../common/MomentCard";
import { mockMomentsData, momentsSection } from "@/app/data/moments";

export default function MomentsSection() {
  return (
    <section className="section-padding mx-6" id="galeri">
      <div className="container-custom">
        {/* Section Header */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-12">
          <div>
            <h2 className="text-responsive-3xl font-bold text-black mb-6 leading-tight">
              <span className="text-primary">Momen</span> & Kenangan
            </h2>
          </div>
          <div>
            <p className="text-responsive-base text-gray-800 leading-relaxed max-w-2xl">{momentsSection.subtitle}</p>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-3 grid-rows-2 gap-4">
          {/* Row 1 */}
          <MomentCard moment={mockMomentsData[0]} size="medium" className="col-span-2" />
          <MomentCard moment={mockMomentsData[1]} size="medium" className="col-start-3" />

          {/* Row 2 */}
          <MomentCard moment={mockMomentsData[0]} size="medium" className="row-start-2" />
          <MomentCard moment={mockMomentsData[1]} size="medium" className="col-start-2 col-span-2" />

          {/* Row 3 - Mobile Hidden */}
          {/* <div className="hidden md:block col-span-1 lg:col-span-2">
            <MomentCard moment={mockMomentsData[4]} size="medium" />
          </div>
          <div className="hidden md:block col-span-1 lg:col-span-2">
            <MomentCard moment={mockMomentsData[5]} size="medium" />
          </div> */}
        </div>
      </div>
    </section>
  );
}
