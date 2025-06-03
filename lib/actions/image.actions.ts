"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import User from "../database/models/user.model";
import Image from "../database/models/image.model";
import { redirect } from "next/navigation";

import { v2 as cloudinary } from 'cloudinary'

const populateUser = (query: any) => query.populate({
  path: 'author',
  model: User,
  select: '_id firstName lastName clerkId'
})

// ADD IMAGE
export async function addImage({ image, userId, path }: AddImageParams) {
  try {
    await connectToDatabase();

    console.log("addImage called with userId:", userId);

    const author = await User.findById(userId);

    if (!author) {
      console.log("User not found for userId:", userId);
      throw new Error("User not found");
    }

    console.log("Found author:", { _id: author._id, clerkId: author.clerkId, email: author.email });

    const newImage = await Image.create({
      ...image,
      author: author._id,
    })

    console.log("Created image:", { _id: newImage._id, author: newImage.author, title: newImage.title });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newImage));
  } catch (error) {
    console.error("Error in addImage:", error);
    handleError(error)
  }
}

// UPDATE IMAGE
export async function updateImage({ image, userId, path }: UpdateImageParams) {
  try {
    await connectToDatabase();

    const imageToUpdate = await Image.findById(image._id);

    if (!imageToUpdate || imageToUpdate.author.toHexString() !== userId) {
      throw new Error("Unauthorized or image not found");
    }

    const updatedImage = await Image.findByIdAndUpdate(
      imageToUpdate._id,
      image,
      { new: true }
    )

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedImage));
  } catch (error) {
    handleError(error)
  }
}

// DELETE IMAGE
export async function deleteImage(imageId: string) {
  try {
    await connectToDatabase();

    await Image.findByIdAndDelete(imageId);
  } catch (error) {
    handleError(error)
  } finally{
    redirect('/')
  }
}

// GET IMAGE
export async function getImageById(imageId: string) {
  try {
    await connectToDatabase();

    const image = await populateUser(Image.findById(imageId));

    if(!image) throw new Error("Image not found");

    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error)
  }
}

// GET IMAGES
export async function getAllImages({ limit = 9, page = 1, searchQuery = '' }: {
  limit?: number;
  page: number;
  searchQuery?: string;
}) {
  try {
    await connectToDatabase();

    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    })

    let expression = 'folder=rhyme_ai_editor';

    if (searchQuery) {
      expression += ` AND ${searchQuery}`
    }

    const { resources } = await cloudinary.search
      .expression(expression)
      .execute();

    const resourceIds = resources.map((resource: any) => resource.public_id);

    let query = {};

    if(searchQuery) {
      query = {
        publicId: {
          $in: resourceIds
        }
      }
    }

    const skipAmount = (Number(page) -1) * limit;

    const images = await populateUser(Image.find(query))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);
    
    const totalImages = await Image.find(query).countDocuments();
    const savedImages = await Image.find().countDocuments();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPage: Math.ceil(totalImages / limit),
      savedImages,
    }
  } catch (error) {
    handleError(error)
  }
}

// GET IMAGES BY USER(profile page)
export async function getUserImages({
  limit = 9,
  page = 1,
  userId,
  searchQuery = '',
}: {
  limit?: number;
  page: number;
  userId: string;
  searchQuery?: string;
}) {
  try {
    await connectToDatabase();

    console.log("getUserImages called with:", { userId, page, limit, searchQuery });

    // Temporarily disable Cloudinary filtering to check if images exist in DB
    let query: any = { author: userId };

    // Only apply Cloudinary search if there's a specific search query
    if(searchQuery) {
      cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      })

      let expression = 'folder=rhyme_ai_editor';
      expression += ` AND ${searchQuery}`;

      const { resources } = await cloudinary.search
        .expression(expression)
        .execute();

      const resourceIds = resources.map((resource: any) => resource.public_id);
      console.log("Cloudinary resourceIds found:", resourceIds.length);

      query = {
        author: userId,
        publicId: {
          $in: resourceIds
        }
      }
    }

    console.log("Database query:", JSON.stringify(query));

    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find(query))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalImages = await Image.find(query).countDocuments();

    console.log("Images found:", images.length, "Total images:", totalImages);

    // Let's also check what images exist for any user
    const allImages = await Image.find({}).limit(5);
    console.log("Sample of all images in DB:", allImages.map(img => ({ 
      _id: img._id, 
      author: img.author, 
      title: img.title,
      publicId: img.publicId 
    })));

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPages: Math.ceil(totalImages / limit),
    };
  } catch (error) {
    console.error("Error in getUserImages:", error);
    handleError(error);
  }
}