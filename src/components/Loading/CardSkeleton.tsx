export default function CardSkeleton() {


    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 mt-10 animate-pulse w-72">

            <div className=" h-56 w-full bg-gray-300"></div>
            <div className="px-6 py-4">
                <div className="h-6 bg-gray-300 mb-4"></div>
                <div className="h-4 bg-gray-300 mb-4"></div>
                <div className="h-4 bg-gray-300 mb-5"></div>
                <div className="h-6 bg-gray-300 mb-12"></div>
                <div className=" h-36 bg-gray-300 mb-12"></div>
                <div className=" h-36 bg-gray-300 mb-12"></div>
                <div className="h-6 bg-gray-300 mb-4"></div>
                <div className="h-4 bg-gray-300 mb-4"></div>
                <div className="h-6 bg-gray-300 mb-4"></div>
            </div>
        </div>

    )
}
