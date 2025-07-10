import { useState } from "react"
import Cropper from 'react-easy-crop'
import { Slider } from "./ui/slider"
import { Area } from "react-easy-crop";
import { Button } from "./ui/button";
import { FaCrop } from "react-icons/fa";

export default function ImageUpload({ file, croppedImage, setCroppedImage }: { file: string, croppedImage: string | null, setCroppedImage: (croppedImage: string) => void }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    console.log(croppedArea, croppedAreaPixels)
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const getCroppedImg = (imageSrc: string, pixelCrop: Area): Promise<string> => {
    return new Promise((resolve) => {
      const image = new Image()
      image.src = imageSrc

      image.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          throw new Error('No 2d context')
        }

        // Set canvas size to the cropped size
        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height

        // Draw the cropped image
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        )

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            resolve(url)
          }
        }, 'image/jpeg', 0.95)
      }
    })
  }

  const handleCrop = async () => {
    if (!croppedAreaPixels) {
      console.error('No crop area available')
      return
    }

    try {
      const croppedImageUrl = await getCroppedImg(file, croppedAreaPixels)
      setCroppedImage(croppedImageUrl)
    } catch (error) {
      console.error('Error cropping image:', error)
    }
  }
  // Validate that the file is a valid data URL
  const isValidDataUrl = file && file.startsWith('data:image/');

  if (!isValidDataUrl) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">Invalid image format. Please provide a valid image file.</p>
      </div>
    );
  }

  return (
    <div className="z-50">
      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
        <Cropper
          image={file}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          style={{
            containerStyle: {
              width: '100%',
              height: '100%',
              backgroundColor: '#f3f4f6'
            }
          }}
        />
      </div>
      <div className="mt-4">
        <Slider
          className="w-full"
          defaultValue={[0]}
          max={10}
          min={1}
          step={0.01}
          onValueChange={(value) => setZoom(value[0])}
        />
      </div>
      <Button className="btn !bg-[#4e9da8] !text-white mt-4" onClick={handleCrop} type="button">
        Crop Image
      </Button>

      {/* {croppedImage && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Cropped Image:</h3>
          <div className="border rounded-lg overflow-hidden">
            <img
              src={croppedImage}
              alt="Cropped"
              className="w-full h-auto max-h-64 object-contain"
            />
          </div>
        </div>
      )} */}
    </div>
  )
}
