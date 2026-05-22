import {
  CalendarCheck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { capitalizeFirstLetter } from "@/lib/utils";

import { HospitalServiceI } from "@/network/hospital-services/types";

interface Props {
  service: HospitalServiceI;
}

const HospitalServiceCard = ({
  service,
}: Props) => {


  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#E5ECEA] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="flex flex-col items-center pt-5 px-5">
        {service.image && service.image.trim() !== '' ? (
          <Image
            src={service.image}
            alt={service.name || "Service Image"}
            width={230}
            height={182}
            className="object-cover rounded w-[230px] h-[182px]"
          />
        ) : (
          <div className="w-[230px] h-[182px] bg-gray-200 flex items-center justify-center rounded">
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">

        <div className="mb-4 flex items-start justify-between">

        <h3 className="line-clamp-1 text-2xl font-bold text-[#173F3A]">
            {capitalizeFirstLetter(service?.name)}
        </h3>

        {service?.daily_booking_count > 0 && (
            <span className="rounded-full bg-[#1B7C7B] px-3 py-1 text-xs font-semibold text-[#1B7C7B] shadow-sm">
            {service.daily_booking_count}+ booked
            </span>
        )}

        </div>


        {/* Description */}
        <p className="mt-3 min-h-[60px] text-sm leading-6 text-[#5C7074] line-clamp-3">
          {service?.description ||
            "Professional healthcare service provided by experienced medical staff."}
        </p>

        {/* Price Card */}
        <div className="mt-5 rounded-xl bg-[#F8FBFA] p-5">

          <p className="text-xs font-semibold uppercase tracking-wide text-[#7B8E92]">
            Service Price
          </p>

          <div className="mt-2 flex items-center gap-3">

            <span className="text-4xl font-bold text-[#1B7C7B]">
              ₹{service?.price}
            </span>

            {Number(service?.strike_through_price) >
              Number(service?.price) && (
              <span className="text-base text-gray-400 line-through">
                ₹{service?.strike_through_price}
              </span>
            )}

          </div>

        </div>

        {/* CTA */}
        <div className="mt-auto pt-5">

          <Link
            href={`/booking/create?type=service&serviceId=${service.id}`}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1D453F] px-6 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#173A35] hover:shadow-lg"
          >
            <CalendarCheck size={18} />
            Book Service
          </Link>

        </div>

      </div>

    </div>
  );
};

export default HospitalServiceCard;