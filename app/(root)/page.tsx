import { Collection } from "@/components/shared/Collection"
import { navLinks } from "@/constants"
import { getUserImages } from "@/lib/actions/image.actions"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getUserById, createUser } from "@/lib/actions/user.actions"
import AnimatedHome from "@/components/shared/AnimatedHome"

const Home = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query as string) || '';

  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  // Try to get the user from database, create if doesn't exist
  let user;
  try {
    user = await getUserById(userId);
  } catch (error) {
    // If user doesn't exist, create them
    console.log("User not found in database, creating new user...");
    const clerkUser = await currentUser();
    
    if (clerkUser) {
      const userData = {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        username: clerkUser.username || clerkUser.firstName || "user",
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        photo: clerkUser.imageUrl,
      };
      
      user = await createUser(userData);
      console.log("New user created:", user._id);
    } else {
      redirect("/sign-in");
    }
  }

  const images = await getUserImages({ page, userId: user._id, searchQuery })

  return (
    <AnimatedHome 
      images={images}
      page={page}
      navLinks={navLinks}
    />
  )
}

export default Home