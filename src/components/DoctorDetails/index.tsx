import React, { useEffect, useMemo, useState } from "react";
import InfoCardPair from "../InfoCardPair";
import HospitalOne from "~/png/HospitalOne.png";
import { DoctorI, ReviewI, TimeSlotI } from "@/network/doctors/types";
import { calculateExperience } from "@/helpers/calculateExperience";

import { categorizeSlots } from "@/helpers/categoriesTimeSlots";
import TimeSlots from "./Timeslots";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DatePicker } from "@/components/ui/date-picker";
import useTimeSlots from "@/hooks/timeslots/use-hook";
// import { useParams } from "next/navigation";

interface DoctorDetailsProps {
  doctor?: DoctorI | null;
  loading?: boolean;
  timeSlots?: TimeSlotI | null;
  reviews?: ReviewI[] | null;
  hasMoreReviews?: boolean;
  loadingMoreReviews?: boolean;
  onLoadMoreReviews?: () => void;
}
interface TabItem {
  id: string;
  title: string;
  component: React.ReactNode;
}

const DoctorDetails = ({
  doctor,
  loading,
  reviews,
  hasMoreReviews,
  onLoadMoreReviews,
  loadingMoreReviews,
}: DoctorDetailsProps) => {
  // const params = useParams();
  // const doctorSlug = params.slug as string;

  const {
    timeSlots,
    loading: timeSlotsLoading,
    error: timeSlotsError,
    selectedDate,
    setSelectedDate,
  } = useTimeSlots({
    doctor_id: doctor?.id,
    autoFetch: true,
  });

  const { morning, evening, afternoon } = categorizeSlots(timeSlots || []);

  // const tabs = [
  //   {
  //     id: "1",
  //     title: "Morning",
  //     component: <TimeSlots timeSlots={morning} />,
  //   },
  //   {
  //     id: "2",
  //     title: "Afternoon",
  //     component: <TimeSlots timeSlots={afternoon} />,
  //   },
  //   {
  //     id: "3",
  //     title: "Evening",
  //     component: <TimeSlots timeSlots={evening} />,
  //   },
  // ];
  const tabs = useMemo(
    () => [
      {
        id: "1",
        title: "Morning",
        component: <TimeSlots timeSlots={morning} />,
      },
      {
        id: "2",
        title: "Afternoon",
        component: <TimeSlots timeSlots={afternoon} />,
      },
      {
        id: "3",
        title: "Evening",
        component: <TimeSlots timeSlots={evening} />,
      },
    ],
    [morning, afternoon, evening]
  );

  const [activeTab, setActiveTab] = useState<TabItem>();
  useEffect(() => {
      setActiveTab(tabs[0]); // always reset when timeSlots change
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeSlots]);

  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(
    new Set()
  );

  const toggleReviewExpansion = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B7C7B]"></div>
      </div>
    );
  }

  const rating = doctor?.avg_rating || 0;
  const specialisation = doctor?.specialisations
    ? doctor?.specialisations[0].name
    : "";

  const experience = doctor?.work_start_date
    ? calculateExperience(doctor?.work_start_date)
    : "";


  return (
    <div>
      <InfoCardPair
        leftCard={{
          imageSrc:
            doctor?.profile_pic && doctor.profile_pic.trim() !== ""
              ? doctor.profile_pic
              : HospitalOne,
          title: doctor?.name || "",
          subtitle: specialisation, // Could be enhanced with specialty field if available
          rating: { value: Math.round(rating), count: reviews?.length || 0 }, // Default values since not in API
          location: doctor?.city
            ? `${doctor?.city} • ${experience} of experience`
            : "",
          phone: doctor?.phone_number || "",
          tag: doctor?.hospital_id ? "Hospital Doctor" : "Independent Practice",
        }}
        rightCard={{
          heading: "About Me",
          description:
            doctor?.about ||
            `${
              doctor?.name
            } is a dedicated medical professional providing quality healthcare services. ${
              doctor?.city ? `Based in ${doctor?.city}, ` : ""
            }committed to patient care and medical excellence.`,
        }}
      />

      <div className="grid md:grid-cols-[3fr_2fr] gap-4 rounded-2xl md:w-7xl md:mx-0 mx-4">
        <div className="space-y-4 rounded-2xl border border-[#E4E4E4] px-4 py-6 gap-6 bg-[#FAFAFA] min-h-[550px] md:min-h-[450px] h-auto">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-[#03182C] font-semibold text-xl">
              Time Slot Available
            </h3>

            {/* DatePicker Section - Top Right */}
            <div className="flex flex-col items-end">
              <DatePicker
                date={selectedDate}
                onDateChange={setSelectedDate}
                placeholder="Select appointment date"
                disabled={(date) => date < new Date()}
                className="w-[200px]"
              />
              {timeSlotsError && (
                <div className="mt-2 text-red-600 text-xs text-right">
                  Error loading time slots: {timeSlotsError}
                </div>
              )}
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="rounded-xl">
            {timeSlotsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1B7C7B]"></div>
                <span className="ml-2 text-gray-600">
                  Loading time slots...
                </span>
              </div>
            ) : timeSlots.length > 0 ? (
              <div className="w-full">
                <div className="flex border-b">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`relative px-4 py-2 text-sm sm:text-base transition-all duration-300 ${
                        activeTab?.id === tab.id
                          ? "text-teal-700 font-medium border-b-2 border-teal-600"
                          : "text-gray-500"
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.title}
                    </button>
                  ))}
                </div>
                <div className="mt-4 text-sm sm:text-base text-gray-700">
                  {activeTab?.component}
                </div>
              </div>
            ) : selectedDate ? (
              <div className="text-center py-8 text-gray-500">
                No time slots available for {selectedDate.toLocaleDateString()}.
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Please select a date to view available time slots.
              </div>
            )}
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-[#E4E4E4] px-4 py-6 gap-6 bg-[#FAFAFA]">
          <h3 className="text-[#03182C] font-semibold text-xl">Reviews</h3>
          <div className="rounded-xl h-[350px] overflow-y-auto">
            {reviews && reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((review, index) => {
                  const reviewId = review.id || index.toString();
                  const isExpanded = expandedReviews.has(reviewId);
                  const reviewText =
                    review.review_note || "No review text available";
                  const shouldShowToggle = reviewText.length > 50; // Test with shorter threshold

                  return (
                    <div
                      key={reviewId}
                      className="bg-white rounded-lg p-3 sm:p-4 border border-gray-100 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                            <AvatarImage
                              src={
                                review.user?.profile_picture ||
                                `https://ui-avatars.com/api/?name=${
                                  review.user?.first_name
                                }+${
                                  review.user?.last_name ?? ""
                                }&background=0d9488&color=fff`
                              }
                              alt={
                                review.user
                                  ? `${review.user.first_name} ${review.user.last_name}`
                                  : "Anonymous"
                              }
                            />
                            <AvatarFallback className="bg-teal-100 text-teal-700 text-xs sm:text-sm font-medium">
                              {review.user?.first_name
                                ?.charAt(0)
                                .toUpperCase() || "A"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 text-sm truncate">
                              {review.user
                                ? `${review.user.first_name ?? ""} ${
                                    review.user.last_name ?? ""
                                  }`
                                : "Anonymous"}
                            </p>
                            <div className="flex items-center space-x-0.5">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${
                                    i <
                                    Math.round(parseInt(review.rating || "0"))
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                              <span className="text-xs text-gray-500 ml-1">
                                {Math.round(parseInt(review.rating || "0"))}/5
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-700 text-sm leading-relaxed">
                        <p>
                          {!isExpanded && shouldShowToggle
                            ? `${reviewText.slice(0, 150)}...`
                            : reviewText}
                        </p>
                        {shouldShowToggle && (
                          <button
                            onClick={() => toggleReviewExpansion(reviewId)}
                            className="text-teal-600 hover:text-teal-700 text-xs font-medium mt-1 transition-colors"
                          >
                            {isExpanded ? "Show less" : "See more"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Load More Button */}
                {hasMoreReviews && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={onLoadMoreReviews}
                      disabled={loadingMoreReviews}
                      className="px-4 py-2 text-sm text-teal-600 hover:text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingMoreReviews ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                          <span>Loading...</span>
                        </div>
                      ) : (
                        "Load More Reviews"
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.697-.413l-2.725.725.725-2.725A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm font-medium">
                  No reviews yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
