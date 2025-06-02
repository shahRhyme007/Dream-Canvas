"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { motion } from "framer-motion";

import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { transformationTypes } from "@/constants";
import { IImage } from "@/lib/database/models/image.model";
import { formUrlQuery } from "@/lib/utils";

import { Button } from "../ui/button";

import { Search } from "./Search";

export const Collection = ({
  hasSearch = false,
  images,
  totalPages = 1,
  page,
}: {
  images: IImage[];
  totalPages?: number;
  page: number;
  hasSearch?: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // PAGINATION HANDLER
  const onPageChange = (action: string) => {
    const pageValue = action === "next" ? Number(page) + 1 : Number(page) - 1;

    const newUrl = formUrlQuery({
      searchParams: searchParams.toString(),
      key: "page",
      value: pageValue,
    });

    router.push(newUrl, { scroll: false });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <motion.div 
        className="collection-heading"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2 
          className="h2-bold text-dark-600 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Recent Edits
        </motion.h2>
        {hasSearch && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Search />
          </motion.div>
        )}
      </motion.div>

      {images.length > 0 ? (
        <motion.ul 
          className="collection-list"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {images.map((image, index) => (
            <motion.div key={`${image._id}-${index}`} variants={itemVariants}>
              <Card image={image} index={index} />
            </motion.div>
          ))}
        </motion.ul>
      ) : (
        <motion.div 
          className="collection-empty"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <p className="p-20-semibold text-gray-500">Empty List</p>
            <p className="text-gray-400 mt-2">Start creating amazing transformations!</p>
          </motion.div>
        </motion.div>
      )}

      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Pagination className="mt-10">
            <PaginationContent className="flex w-full">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  disabled={Number(page) <= 1}
                  className="collection-btn"
                  onClick={() => onPageChange("prev")}
                >
                  <PaginationPrevious className="hover:bg-transparent hover:text-white" />
                </Button>
              </motion.div>

              <p className="flex-center p-16-medium w-fit flex-1">
                {page} / {totalPages}
              </p>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="button w-32 bg-purple-gradient bg-cover text-white"
                  onClick={() => onPageChange("next")}
                  disabled={Number(page) >= totalPages}
                >
                  <PaginationNext className="hover:bg-transparent hover:text-white" />
                </Button>
              </motion.div>
            </PaginationContent>
          </Pagination>
        </motion.div>
      )}
    </>
  );
};

const Card = ({ image, index }: { image: IImage; index: number }) => {
  return (
    <motion.li
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { type: "spring", stiffness: 300 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/transformations/${image._id}`} className="collection-card group">
        <motion.div
          className="relative overflow-hidden rounded-[10px]"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <CldImage
            src={image.publicId}
            alt={image.title}
            width={image.width}
            height={image.height}
            {...image.config}
            loading="lazy"
            className="h-52 w-full rounded-[10px] object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[10px]" />
          <motion.div 
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ scale: 1.1 }}
          >
            <Image
              src={`/assets/icons/${
                transformationTypes[
                  image.transformationType as TransformationTypeKey
                ].icon
              }`}
              alt={image.title}
              width={16}
              height={16}
            />
          </motion.div>
        </motion.div>
        <div className="flex-between pt-4">
          <motion.p 
            className="p-20-semibold mr-3 line-clamp-1 text-dark-600"
            whileHover={{ color: "#8b5cf6" }}
          >
            {image.title}
          </motion.p>
          <motion.div
            className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100"
            whileHover={{ scale: 1.2, backgroundColor: "#8b5cf6" }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={`/assets/icons/${
                transformationTypes[
                  image.transformationType as TransformationTypeKey
                ].icon
              }`}
              alt={image.title}
              width={12}
              height={12}
              className="transition-all duration-200"
            />
          </motion.div>
        </div>
      </Link>
    </motion.li>
  );
};