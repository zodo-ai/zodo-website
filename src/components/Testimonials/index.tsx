import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const testimonials = [
  {
    text: `This hospital booking app has transformed how we schedule appointments. The intuitive interface and real-time updates have saved us hours of coordination and improved patient satisfaction across the board.`,
    name: "Sarah J.",
    role: "Operations Manager, CityCare Hospital",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
  },
  {
    text: `Thanks to this hospital booking app, managing patient appointments is now seamless. The automated reminders and smooth integration with our systems have streamlined operations and reduced no-shows significantly.`,
    name: "John D.",
    role: "Clinic Administrator, NovaMed Center",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  },
];


const Testimonials = () => {
  return (
      <Carousel className="w-full max-w-4xl">
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index}>
              <div className="p-2 relative text-start">
                <Card className="rounded-2xl shadow-sm border-none bg-white z-20 relative mx-1">
                  <CardContent className="px-8 py-4 flex flex-col gap-6">
                    <p className="text-lg text-gray-900 leading-relaxed font-medium">
                      “{testimonial.text}”
                    </p>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage width={60} height={60} src={testimonial.image} />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-[#1B0C25] text-sm">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-[#1B0C25] opacity-60">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="w-full h-[75%] rounded-lg bg-white opacity-50 absolute top-0 bottom-0 left-0 right-0 my-auto z-10"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="w-10 h-10 hidden lg:flex" />
        <CarouselNext className="w-10 h-10 hidden lg:flex" />
      </Carousel>
  );
};

export default Testimonials;
