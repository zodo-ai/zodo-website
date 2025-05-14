'use client'
import CustomHead from "@/components/CustomHead";
import CustomSearch from "@/components/CustomSearch";
import DoctorCard from "@/components/DoctorCard";
import DownloadApp from "@/components/DownloadApp";
import HospitalDetails from "@/components/HospitalDetails";
import Lister from "@/components/Lister";
import SearchFilters from "@/components/SearchFilters";
import { doctors } from "@/dummy/doctors";
import { hospitalDoctorFilters } from "@/dummy/filters";
import { locations } from "@/dummy/locations";

const HospitalDetailed = () => {
    return (
        <div>
            <div className="flex flex-col items-center justify-center">
                <div className="space-y-10 mt-20">
                    <CustomHead text='Find Your Hospital' highlight='Hospital' />
                    <HospitalDetails />
                    <h4 className="text-[#004746] font-medium text-4xl text-center">Doctors From Apollo</h4>
                    <div className="flex flex-col items-center justify-center gap-10 mb-10">
                        <CustomSearch locations={locations} />
                        <SearchFilters filters={hospitalDoctorFilters} />
                    </div>
                </div>

            </div>

            <section className="max-w-7xl mx-auto px-4 mb-10">
                <Lister
                    items={doctors}
                    itemsPerPage={12}
                    renderItem={(doctor) => (
                        <DoctorCard
                            name={doctor.name}
                            specialty={doctor.specialty}
                            image={doctor.image}
                        />
                    )}
                />
            </section>

            <DownloadApp />




        </div>
    )
}

export default HospitalDetailed;