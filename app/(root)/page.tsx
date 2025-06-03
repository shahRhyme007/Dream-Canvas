import { Collection } from "@/components/shared/Collection"
import { navLinks } from "@/constants"
import { getUserImages } from "@/lib/actions/image.actions"
import { auth, currentUser } from "@clerk/nextjs/server"
import { findUserByClerkId, createOrGetUser } from "@/lib/actions/user.actions"
import AnimatedHome from "@/components/shared/AnimatedHome"
import LandingPage from "@/components/shared/LandingPage"

const Home = async ({ searchParams }: SearchParamProps) => {
  const { userId } = auth();

  // If user is not authenticated, show landing page
  if (!userId) {
    return <LandingPage />;
  }

  // If user is authenticated, show the dashboard
  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query as string) || '';

  // Try to get the user from database, create if doesn't exist
  let user = await findUserByClerkId(userId);
  
  if (!user) {
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
      
      user = await createOrGetUser(userData);
      console.log("User created/retrieved:", user._id);
    } else {
      return <LandingPage />;
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