import { useEffect, useState } from 'react';
// import { Rating } from 'flowbite-react';
// import { RatingStar } from 'flowbite-react/lib/esm/components/Rating/RatingStar';
import Toggle from '../Toggle/Toggle';
import ToggleButton from '../Toggle/ToggleButton';
import ToggleOn from '../Toggle/ToggleOn';
import SimpleModal from '../Modals/SimpleModal';
import supabase from '../../config/supabaseClient';
import StarRatings from 'react-star-ratings';

type NameType = {
    name: string
    postId: string
    user: any
}

export default function RatingComp({ name, postId, user }: NameType) {
    const [userRating, setUserRating] = useState(null);
    // const [isModalOpen, setIsModalOpen] = useState(false)
    const [ratings, setRating] = useState()
    const [ratingSubmitted, setRatingSubmitted] = useState(false);


    const handleStarClick = (rating: number) => {
        setUserRating(rating);
    };
    const getRatings = async () => {
        const { data, error } = await supabase
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
            // getRatings();
        }
        setRatingSubmitted(true);
    }
    const filteredRatings = ratings?.filter(rating => rating.postId === postId);
    const displayRating = () => {
        if (filteredRatings && filteredRatings.length > 0) {
            const averageRating = filteredRatings.reduce((acc, curr) => acc + curr.rating, 0) / filteredRatings.length;
            return +averageRating.toFixed(2);
        }
        return 0;
    };

    return (
        <div className="rating flex flex-col mt-3">
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
                    // optionalFunction={() => setIsModalOpen(true)}
                    >
                        Add a rating
                    </ToggleButton>
                    <ToggleOn>
                        {user ? (!hasRated ?
                            <SimpleModal
                                title={`Leave a rating for ${name}`}
                                onClickFunction={handleClick}
                                btnClassName="btn btn-success"
                                condBtnRender={userRating}
                                ratingSubmitted={ratingSubmitted}
                            >
                                <StarRatings
                                    rating={userRating || 0}
                                    starRatedColor="gold"
                                    starHoverColor="gold"
                                    changeRating={handleStarClick}
                                    numberOfStars={5}
                                    name='userRating'
                                />
                            </SimpleModal>
                            :
                            <SimpleModal>
                                <p>You've already rated this business</p>
                            </SimpleModal>
                        ) :
                            <SimpleModal>Please login to continue</SimpleModal>
                        }
                    </ToggleOn>
                </Toggle>
            </div>



        </div>
    );
}
