import Header from '@/components/shared/Header'
import React from 'react'
import {transformationTypes} from '@/constants'
import TransformationForm from '@/components/shared/TransformationForm'
import { auth, currentUser } from '@clerk/nextjs/server'
import { getUserById, createUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'

const AddTrransformationTypePage = async({params : {type}} : SearchParamProps) => {
  const transformation = transformationTypes[type]
  const {userId} = auth()

  if (!userId) redirect('/sign-in')

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

  return (
    <>
     <Header title={transformation.title}
        subtitle={transformation.subTitle}/>

      <section className='mt-10'>

        <TransformationForm
        action='Add'
        userId={user._id}
        type = {transformation.type as TransformationTypeKey}
        creditBalance={user.creditBalance}
        
        />
      </section>

      
    
    </>


   


  )
}

export default AddTrransformationTypePage