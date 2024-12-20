import { useEffect, useState } from 'react';
import Toggle from '../Toggle/Toggle';
import ToggleButton from '../Toggle/ToggleButton';
import ToggleOn from '../Toggle/ToggleOn';
import supabase from '../../config/supabaseClient';
import StarRatings from 'react-star-ratings';
import CustomModal from '../Modals/CustomModal';
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import Login from '../../pages/Login';
import { isCoordinateWithinRadius } from '../Location/locationHelpers';
import { IoStar } from "react-icons/io5";

type NameType = {
    name?: string
    postId?: string
    user?: any,
    coordinates?: {
        latitude: number,
        longitude: number
    }
}
type RatingsType = {
    id: number,
    userId: string,
    rating: number,
    postId: string,
    isLocal: boolean
}
export default function RatingComp({ name, postId, user, coordinates }: NameType) {
    const [userRating, setUserRating] = useState<number>(0);
    const [ratings, setRating] = useState<RatingsType[]>()
    const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);
    const [isLocal, setIsLocal] = useState<boolean>(false)

    useEffect(() => {
        if (user) {
            getMemberCoordinates()
        }
    }, [user])

    const getMemberCoordinates = async () => {
        const { data, error } = await supabase
            .from("locations")
            .select("coordinates, altCoordinates")
            .eq("userId", user?.id)
            .single()

        if (error) {
            console.error(error);
        }
        if (data) {
            setIsLocal(
                isCoordinateWithinRadius({ latitude: data?.altCoordinates?.latitude, longitude: data?.altCoordinates?.longitude }
                    , { latitude: coordinates?.latitude, longitude: coordinates?.longitude }, 10000) || isCoordinateWithinRadius({ latitude: data?.coordinates.latitude, longitude: data?.coordinates.longitude }
                        , { latitude: coordinates?.latitude, longitude: coordinates?.longitude }, 10000)
            )
        }
    }

    const handleStarClick = (rating: number) => {
        setUserRating(rating);
    };

    const getRatings = async () => {
        const { data, error }: any = await supabase
            .from("ratings")
            .select("*")
        if (error) {
            console.log(error);
        }
        setRating(data)
    }

    useEffect(() => {
        getRatings()
    }, [])
    const hasRated = ratings?.some(item => {
        return user?.id === item.userId && postId === item.postId;
    });
    const handleClick = async () => {
        if (!hasRated) {
            const { error } = await supabase
                .from("ratings")
                .insert({ rating: userRating, postId: postId, userId: user.id, isLocal: isLocal })

            if (error) {
                console.log(error);
            }
        }
        setRatingSubmitted(true);
    }
    const filteredRatings = ratings?.filter(rating => rating.postId === postId && rating.isLocal === true);
    const displayRating = () => {
        if (filteredRatings && filteredRatings.length > 0) {
            const averageRating =
                filteredRatings.reduce((acc, curr) => acc + curr.rating, 0) /
                filteredRatings.length;
            return Number(averageRating).toFixed(1);
        }
        return 0.0;
    };

    const ratingModalEl = () => {
        if (ratingSubmitted) {
            return (
                <>
                    <div className="flex items-center flex-col gap-5">
                        <div style={{ fontSize: "50px" }}>

                            <IoCheckmarkCircleOutline style={{ color: 'green' }} />
                        </div>


                        <h2 className=" text-xl">Thank you for submitting your rating!</h2>
                        <h2 className=" text-lg">Your rating will be displayed when page refreshes.</h2>
                    </div>
                </>
            )
        }
        if (!user) {
            return (
                <>
                    <Login title="Please login to rate this business:" />
                </>
            )
            return
        }
        else {
            if (!hasRated) {
                return (
                    <div className="flex flex-col items-center gap-5">
                        <h2 className="font-bold text-xl">Leave a rating for {name}</h2>
                        <div className=' w-80'>
                            <StarRatings
                                rating={userRating || 0}
                                starRatedColor="gold"
                                starHoverColor="gold"
                                changeRating={handleStarClick}
                                numberOfStars={5}
                                name='userRating'

                            />
                        </div>
                        <button className={`${userRating ? "btn btn-success" : "btn btn-disabled"}`} onClick={handleClick}>Submit</button>
                    </div>
                )

            }
            else if (hasRated) {
                return <div className="my-4 text-lg">You've already rated this business.</div>
            }
        }
    }
    const reviewEl = () => {
        if (filteredRatings?.length === 1) {
            return `(reviewed by ${filteredRatings?.length} local)`
            // return `(${filteredRatings?.length} review)`
        } else if (filteredRatings?.length === 0) {
            return null
        }
        return `(reviews by ${filteredRatings?.length} locals)`
    }

    return (
        <div className="flex mt-3 flex-col gap-2 ">
            <div className='flex items-center gap-2.5'>
                <span className=' text-lg text-yellow-500 -ml-0.5'>
                    <IoStar />
                </span>
                <div className=' flex items-center gap-1'>
                    {/* <span className=' font-bold'>Locals Rate:</span> */}
                    {name && <span className=''>{displayRating() === 0 ? <span>No local ratings yet</span> : <span className=' font-bold'>{displayRating()} / 5.0</span>}</span>}
                    <span className=' text-gray-500'>{reviewEl()}</span>
                </div>
            </div>
            {name && <div>
                {!hasRated ? <Toggle>
                    <ToggleButton className="text-xs font-bold text-blue-600 cursor-pointer ml-7 uppercase">
                        RATE US!
                    </ToggleButton>
                    <ToggleOn>
                        <CustomModal>
                            {ratingModalEl()}
                        </CustomModal>
                    </ToggleOn>
                </Toggle> :
                    <div className='uppercase text-xs font-bold ml-7 text-green-500'>already rated!</div>
                }
            </div>}
        </div>
    );
}
