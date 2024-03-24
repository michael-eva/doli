import { CardProps } from "../../Types";

const isDeliveryMethod = (delivery: boolean, dineIn: boolean, pickUp: boolean) => {
    if (!delivery && !pickUp && !dineIn) {
        return false
    }
    return true
}
const hasOpeningHours = (openingHours: any) => {
    for (const item of openingHours) {
        if (item.isOpen === 'open' && item.fromTime === '00:00' && item.toTime === '00:00') {
            return { validOpeningTimes: false }; // Invalid opening hours
        }
        if (item.isOpen !== 'closed') {
            return true; // At least one day is open
        }
    }
    return { hasOpenDays: false } // All days are closed

}
const hasSelectedLocation = (selectedLocation: any) => {
    if (selectedLocation.length > 0) {
        return true
    }
    return false
}
function determineRejectionStatus(formData: CardProps, postData: CardProps){
    const isNameChanged = formData.name !== postData?.name;
    const isDescriptionChanged = formData.description !== postData?.description;
    const isImageChanged = formData.imgUrl && formData.imgUrl.length > 0;
    return isNameChanged || isDescriptionChanged || isImageChanged ? false : true
}
function determineVerificationStatus(formData: CardProps, postData?: CardProps) {
    if (postData?.isVerified === false) {
        return false
    }
    const isNameChanged = formData.name !== postData?.name;
    const isDescriptionChanged = formData.description !== postData?.description;
    const isImageChanged = formData.imgUrl && formData.imgUrl.length > 0;
    return isNameChanged || isDescriptionChanged || isImageChanged ? false : true
}

function handleErrors({ delivery, dineIn, pickUp }: { delivery: boolean, dineIn: boolean, pickUp: boolean }, { openingHours }: { openingHours: any }, { selectedLocation }: { selectedLocation: any }) {


    return { isDeliveryMethod: isDeliveryMethod(delivery, dineIn, pickUp), hasOpeningHours: hasOpeningHours(openingHours), hasSelectedLocation: hasSelectedLocation(selectedLocation) }
}

function countChars(name: string) {
    const watchValue = name
    const inputLength = watchValue?.length
    return inputLength
}

export { determineVerificationStatus, handleErrors, countChars, determineRejectionStatus }