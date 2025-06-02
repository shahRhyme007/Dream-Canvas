import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constants";
import { getUserById, createUser } from "@/lib/actions/user.actions";
import { getImageById } from "@/lib/actions/image.actions";

const Page = async ({ params: { id } }: SearchParamProps) => {
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

  const image = await getImageById(id);

  const transformation =
    transformationTypes[image.transformationType as TransformationTypeKey];

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />

      <section className="mt-10">
        <TransformationForm
          action="Update"
          userId={user._id}
          type={image.transformationType as TransformationTypeKey}
          creditBalance={user.creditBalance}
          config={image.config}
          data={image}
        />
      </section>
    </>
  );
};

export default Page;