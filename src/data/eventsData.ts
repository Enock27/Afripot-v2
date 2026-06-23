export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  isFeatured?: boolean;
}

export const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "ANNUAL GALA NIGHT 2025",
    date: "Saturday, August 16, 2025",
    time: "7:00 PM",
    location: "Kigali Convention Centre, Rwanda",
    description: "An exclusive evening celebrating excellence, community, and vision. Join us for an unforgettable night of music, food, and culture.",
    image: "/src/assets/eventBannerUI/eventBanner1.jpg",
    isFeatured: true,
  },
  {
    id: "2",
    title: "LEADERSHIP SUMMIT",
    date: "July 5, 2025",
    time: "7:00 AM - 4:00 PM",
    location: "Kigali",
    description: "Empowering the next generation of leaders with insights from industry experts.",
    image: "/src/assets/AfroMusic1.jpg",
  },
  {
    id: "3",
    title: "TECH INNOVATION EXPO",
    date: "July 20, 2025",
    time: "10:00 AM - 6:00 PM",
    location: "Kigali",
    description: "Discover the latest in technology and innovation from across the continent.",
    image: "/src/assets/AfroMusic2.jpg",
  },
  {
    id: "4",
    title: "COMMUNITY AWARDS NIGHT",
    date: "August 2, 2025",
    time: "6:30 PM - 10:30 PM",
    location: "Musanze",
    description: "Honoring those who make a difference in our communities.",
    image: "/src/assets/AfroMusic1.jpg",
  },
];
