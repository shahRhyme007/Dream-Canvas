"use client"
 
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { config, title } from "process"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "@/constants"
import { CustomField } from "./CustomField"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useEffect, useState, useTransition } from "react"
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils"
import { updateCredits } from "@/lib/actions/user.actions"
import MediaUploader from "./MediaUploader"
import TransformedImage from "../shared/TransformedImage"
import { getCldImageUrl } from "next-cloudinary"
import { addImage, updateImage } from "@/lib/actions/image.actions"
import { useRouter } from "next/navigation"
import { InsufficientCreditsModal } from "./InsufficientCreditsModal"
  


export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
})

const TransformationForm = ({action, data = null, userId, type, creditBalance, config = null}:TransformationFormProps) => {

    const transformationType = transformationTypes[type]
    const [image, setImage]  = useState(data)
    const [newTransformation, setNewTransformation] = useState<Transformations | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);
    const [transformationConfig, setTransformationConfig] = useState(config);

    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    }

    const initialValues = data && action === "Update" ? {
        title: data?.title,
        aspectRatio: data?.aspectRatio,
        color: data?.color,
        prompt: data?.prompt,
        publicId: data?.publicId,

    } : defaultValues



//  1. Define your form and form state.
    const onSelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
        const imageSize = aspectRatioOptions[value as AspectRatioKey]
    
        setImage((prevState: any) => ({
          ...prevState,
          aspectRatio: imageSize.aspectRatio,
          width: imageSize.width,
          height: imageSize.height,
        }))
        setNewTransformation(transformationType.config);

        return onChangeField(value)
    }

  



    const onInputChangeHandler = (fieldName: string, value: string, type: string, onChangeField: (value: string) => void) => {
        debounce(() => {
          setNewTransformation((prevState: any) => ({
            ...prevState,
            [type]: {
              ...prevState?.[type],
              [fieldName === 'prompt' ? 'prompt' : 'to' ]: value 
            }
          }))
        }, 1000)();
          
        return onChangeField(value)
      }


      const onTransformHandler = async () => {
        setIsTransforming(true)
    
        setTransformationConfig(
          deepMergeObjects(newTransformation, transformationConfig)
        )
    
        setNewTransformation(null)
    
        startTransition(async () => {
          await updateCredits(userId, creditFee)
        })
      }
    
      useEffect(() => {
        if(image && (type === 'restore' || type === 'removeBackground')) {
          setNewTransformation(transformationType.config)
        }
      }, [image, transformationType.config, type])
    


     // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("TransformationForm onSubmit called with:", values);
    console.log("Current image state:", image);
    console.log("Current transformationConfig:", transformationConfig);
    console.log("Action:", action, "UserId:", userId);
    
    setIsSubmitting(true);

    if(data || image) {
      const transformationUrl = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...transformationConfig
      })

      const imageData = {
        title: values.title,
        publicId: image?.publicId,
        transformationType: type,
        width: image?.width,
        height: image?.height,
        config: transformationConfig,
        secureURL: image?.secureURL,
        transformationURL: transformationUrl,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color,
      }

      console.log("Image data to be saved:", imageData);

      if(action === 'Add') {
        try {
          console.log("Calling addImage with:", { imageData, userId, path: '/' });
          const newImage = await addImage({
            image: imageData,
            userId,
            path: '/'
          })

          console.log("addImage returned:", newImage);

          if(newImage) {
            form.reset()
            setImage(data)
            router.push(`/transformations/${newImage._id}`)
          }
        } catch (error) {
          console.error("Error in addImage:", error);
        }
      }

      if(action === 'Update') {
        try {
          const updatedImage = await updateImage({
            image: {
              ...imageData,
              _id: data._id
            },
            userId,
            path: `/transformations/${data._id}`
          })

          if(updatedImage) {
            router.push(`/transformations/${updatedImage._id}`)
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      console.log("No data or image to submit");
    }

    setIsSubmitting(false)
  }


  useEffect(() => {
    if(image && (type === 'restore' || type === 'removeBackground')) {
      setNewTransformation(transformationType.config)
    }
  }, [image, transformationType.config, type])



  return (
    <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
         {creditBalance <Math.abs(creditFee) && <InsufficientCreditsModal/>}

        <motion.div variants={itemVariants}>
          <CustomField
                control={form.control}
                name="title"
                formLabel="Image Title"
                className="w-full"
                render={({ field }) => <Input {...field} className="input-field" />}
            />
        </motion.div>

        {type === 'fill' && (
            <motion.div variants={itemVariants}>
              <CustomField
                  control={form.control}
                  name="aspectRatio"
                  formLabel="Aspect Ratio"
                  className="w-full"
                  render={({ field }) => (
                  <Select
                      onValueChange={(value) => onSelectFieldHandler(value, field.onChange)}
                      value={field.value}
                  >
                      <SelectTrigger className="select-field">
                      <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                      {Object.keys(aspectRatioOptions).map((key) => (
                          <SelectItem key={key} value={key} className="select-item">
                          {aspectRatioOptions[key as AspectRatioKey].label}
                          </SelectItem>
                      ))}
                      </SelectContent>
                  </Select>
                  )}  
              />
            </motion.div>
        )}


        {(type === 'remove' || type === 'recolor') && (
          <motion.div 
            className="prompt-field"
            variants={itemVariants}
          >
            <CustomField 
              control={form.control}
              name="prompt"
              formLabel={
                type === 'remove' ? 'Object to remove' : 'Object to recolor'
              }
              className="w-full"
              render={({ field }) => (
                <Input 
                  value={field.value}
                  className="input-field"
                  onChange={(e) => onInputChangeHandler(
                    'prompt',
                    e.target.value,
                    type,
                    field.onChange
                  )}
                />
              )}
            />       

            {type === 'recolor' && (
              <CustomField 
                control={form.control}
                name="color"
                formLabel="Replacement Color"
                className="w-full"
                render={({ field }) => (
                  <Input 
                    value={field.value}
                    className="input-field"
                    onChange={(e) => onInputChangeHandler(
                      'color',
                      e.target.value,
                      'recolor',
                      field.onChange
                    )}
                  />
                )}
              />
            )}
          </motion.div>
        )}


        {/* CLOUDINARY */}
        <motion.div 
          className="media-uploader-field"
          variants={itemVariants}
        >
          <CustomField 
            control={form.control}
            name="publicId"
            className="flex size-full flex-col"
            render={({ field }) => (
              <MediaUploader 
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                image={image}
                type={type}
              />
            )}
          />

          <TransformedImage 
            image={image}
            type={type}
            title={form.getValues().title}
            isTransforming={isTransforming}
            setIsTransforming={setIsTransforming}
            transformationConfig={transformationConfig}
          />
        </motion.div>


        {/* SUBMIT BUTTON */}
        <motion.div 
          className="flex flex-col gap-4"
          variants={itemVariants}
        >

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button type="button"
              className="submit-button capitalize"
              disabled = {isTransforming || newTransformation === null}
              onClick={onTransformHandler}
            >
                {isTransforming ? 'Transforming...' : 'Apply transformation'}
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button type="submit"
              className="submit-button capitalize"
              disabled = {isSubmitting}
            >{isSubmitting ? 'Submitting...' : 'Save Image'}</Button>
          </motion.div>
        </motion.div>
      </form>
    </Form>
    </motion.div>
  )
}

export default TransformationForm