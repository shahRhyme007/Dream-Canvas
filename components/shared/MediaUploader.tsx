import { useToast } from "../ui/use-toast"
import {CldUploadWidget} from "next-cloudinary"

const MediaUploader = () => {

  const {toast} = useToast()

  const onUploadSuccessHandler = (result: any) => {
    setImage((prevState: any) => ({
      ...prevState,
      publicId: result?.info?.public_id,
      width: result?.info?.width,
      height: result?.info?.height,
      secureURL: result?.info?.secure_url
    }))

    onValueChange(result?.info?.public_id)

    toast({
      title: 'Image uploaded successfully',
      description: '1 credit was deducted from your account',
      duration: 5000,
      className: 'success-toast' 
    })
  }




  return (
    <CldUploadWidget
    uploadPreset="rhyme_ai_editor"
    options={{
      multiple: false,
      resourceType: "image",
    }}
    onSuccess={onUploadSuccessHandler}
    onError={onUploadErrorHandler} 
    
    >

    </CldUploadWidget>
  )
}

export default MediaUploader