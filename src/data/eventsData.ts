import afroMusic1 from "@/assets/AfroMusic1.jpg";
import afroMusic2 from "@/assets/AfroMusic2.jpg";

export interface Event {
  id: string;
  title: string;
  date: string;
  day: string;
  time: string;
  description: string;
  artist?: string;
  category: "music" | "dining" | "cultural" | "special";
  image: string;
  banner?: string;
  attendees?: number;
  featured?: boolean;
}

export const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "Live Afro Jazz Night",
    date: "Friday, May 24",
    day: "Friday",
    time: "19:00 - 23:00",
    description: "Experience the smooth rhythms of Afro Jazz with our featured artist. A night of soulful music, delicious food, and great company.",
    artist: "The Kigali Jazz Collective",
    category: "music",
    image: afroMusic1,
    banner: afroMusic2,
    attendees: 45,
    featured: true,
  },
  {
    id: "2",
    title: "Traditional African Cooking Class",
    date: "Saturday, May 25",
    day: "Saturday",
    time: "14:00 - 17:00",
    description: "Learn to prepare authentic African dishes from our master chefs. Hands-on experience with traditional cooking techniques.",
    category: "dining",
    image: afroMusic2,
    banner: afroMusic2,
    attendees: 20,
  },
  {
    id: "3",
    title: "Cultural Heritage Celebration",
    date: "Sunday, May 26",
    day: "Sunday",
    time: "18:00 - 22:00",
    description: "Celebrate African culture with traditional performances, storytelling, and a special menu featuring dishes from across the continent.",
    category: "cultural",
    image: afroMusic1,
    banner: afroMusic1,
    attendees: 60,
  },
  {
    id: "4",
    title: "Wine & Dine Evening",
    date: "Wednesday, May 29",
    day: "Wednesday",
    time: "19:30 - 22:30",
    description: "Pair our signature dishes with carefully selected wines. An evening of culinary excellence and refined taste.",
    category: "special",
    image: afroMusic2,
    banner: afroMusic2,
    attendees: 35,
  },
  {
    id: "5",
    title: "Live Reggae & Soul",
    date: "Friday, May 31",
    day: "Friday",
    time: "20:00 - 23:30",
    description: "Feel the vibes with live reggae and soul music. Dance, eat, and celebrate the African spirit.",
    artist: "Rhythm & Soul Band",
    category: "music",
    image: afroMusic2,
    banner: afroMusic2,
    attendees: 50,
  },
];

export const pastEvents: Event[] = [
  {
    id: "p1",
    title: "Kigali Food Festival",
    date: "May 15",
    day: "Wednesday",
    time: "17:00 - 21:00",
    description: "A celebration of Kigali's diverse culinary scene.",
    category: "dining",
    image: afroMusic1,
    attendees: 120,
  },
  {
    id: "p2",
    title: "African Storytelling Night",
    date: "May 10",
    day: "Friday",
    time: "19:00 - 21:00",
    description: "Traditional stories from across Africa.",
    category: "cultural",
    image: afroMusic2,
    attendees: 75,
  },
];
