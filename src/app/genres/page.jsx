import Link from "next/link";
import {
  BookOpen,
  Ghost,
  Compass,
  User,
  Sword,
  Landmark,
  Rocket,
  Feather,
  Theater,
  Baby,
  Utensils,
  ShieldAlert,
  Sparkles,
  Heart,
  Lightbulb,
  Plane,
  Laugh,
  Users,
  AlertTriangle,
  BookMarked,
} from "lucide-react";

const genreIcons = {
  Thriller: ShieldAlert,
  Horror: Ghost,
  Adventure: Compass,
  Biography: User,
  Action: Sword,
  "Historical Fiction": Landmark,
  "Science Fiction": Rocket,
  Poetry: Feather,
  Drama: Theater,
  "Children's": Baby,
  Cookbook: Utensils,
  Crime: ShieldAlert,
  Fantasy: Sparkles,
  "Self-Help": Lightbulb,
  Mystery: BookOpen,
  Travel: Plane,
  Humor: Laugh,
  Romance: Heart,
  "Young Adult": Users,
  Dystopian: AlertTriangle,
  "Non-fiction": BookMarked,
};

export default async function GenrePage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/genres`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch genres");
  }

  const genres = await res.json();

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
        <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Browse by Genre
        </span>
        <div className="mt-3 flex justify-center">
          <span className="h-1 w-20 rounded-full bg-gradient-to-r from-primary via-secondary to-accent"></span>
        </div>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
        {genres.map((g) => {
          const Icon = genreIcons[g._id] || BookOpen; // fallback icon
          return (
            <Link
              key={g._id}
              href={`/books?genre=${g._id}`}
              className="group flex flex-col items-center justify-center p-6 bg-base-200 rounded-2xl shadow-lg border-2 border-transparent hover:border-primary transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="p-4 rounded-full bg-primary/20 group-hover:bg-primary transition-colors duration-300">
                <Icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <p className="mt-4 text-center text-neutral font-semibold text-base md:text-lg group-hover:text-primary transition-colors duration-300">
                {g._id}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
