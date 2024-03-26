import { Helmet } from 'react-helmet'
export default function NotFound() {

    return (
        <>
            {/* <Helmet>
                <title>doli | Not Found</title>
                <meta name="description" content="Page not found" />
            </Helmet> */}
            <div className="flex justify-center">
                <h1 className=" font-bold text-2xl mt-5">Sorry, the page you're looking for doesn't exist</h1>
            </div>
        </>
    )
}