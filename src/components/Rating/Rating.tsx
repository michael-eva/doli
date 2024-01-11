import { useEffect, useState } from 'react';
import Toggle from '../Toggle/Toggle';
import ToggleButton from '../Toggle/ToggleButton';
import ToggleOn from '../Toggle/ToggleOn';
import supabase from '../../config/supabaseClient';
import StarRatings from 'react-star-ratings';
import CustomModal from '../Modals/CustomModal';
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import Login from '../../pages/Login';

type NameType = {
    name: string
    postId: string
    user: any
}
type RatingsType = {
    id: number,
    userId: string,
    rating: number,
    postId: string,
}
export default function RatingComp({ name, postId, user }: NameType) {
    const [userRating, setUserRating] = useState<number>(0);
    const [ratings, setRating] = useState<RatingsType[]>()
    const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);

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
                .insert({ rating: userRating, postId: postId, userId: user.id })

            if (error) {
                console.log(error);
            }
        }
        setRatingSubmitted(true);
    }
    const filteredRatings = ratings?.filter(rating => rating.postId === postId);
    const displayRating = () => {
        if (filteredRatings && filteredRatings.length > 0) {
            const averageRating =
                filteredRatings.reduce((acc, curr) => acc + curr.rating, 0) /
                filteredRatings.length;
            return isNaN(averageRating) ? 0 : +averageRating.toFixed(2);
        }
        return 0;
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


    return (
        <div className="mt-3">
            <div className="flex items-center">
                <StarRatings
                    rating={displayRating()}
                    starRatedColor="orange"
                    numberOfStars={5}
                    name='rating'
                    starDimension="30px"
                />
            </div>
            <div className='flex mt-2'>
                <p className="ml-2 text-xs font-medium">{displayRating()} / 5</p>
                <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>({filteredRatings?.length})</p>
                <Toggle>
                    <ToggleButton
                        className="text-xs text-blue-600 italic cursor-pointer"
                    >
                        Add a rating
                    </ToggleButton>
                    <ToggleOn>
                        <CustomModal>
                            {ratingModalEl()}
                        </CustomModal>
                    </ToggleOn>
                </Toggle>
            </div>
        </div>
    );
}
