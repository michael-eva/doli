/**
 * v0 by Vercel.
 * @see https://v0.dev/t/yAHBuLThBPa
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { GiPokerHand } from "react-icons/gi"
import { IoFastFoodOutline } from "react-icons/io5"
import { LiaBuildingSolid } from "react-icons/lia"
import { MdOutlineTableRestaurant } from "react-icons/md"

export default function AboutPage() {
  return (
    <>
      <div className="relative bg-gray-50 py-12 lg:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl" style={{ color: "#4d9da8" }}>
                Discover local businesses
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Our directory makes it easy to find and support the best local restaurants, shops, and service providers
                in your area. Whether you're looking for a cozy cafe, unique boutique, or trusted handyman, we've got
                you covered.
              </p>
            </div>
            <div className="grid gap-4">
              <div className="flex items-start gap-4">
                <CheckIcon className="h-6 w-6 flex-shrink-0" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Support local businesses and your community</p>
              </div>
              <div className="flex items-start gap-4">
                <CheckIcon className="h-6 w-6 flex-shrink-0" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Discover hidden gems and new favorites</p>
              </div>
              <div className="flex items-start gap-4">
                <CheckIcon className="h-6 w-6 flex-shrink-0" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Easily find businesses near you or in a specific location
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:items-end">
            </div>
          </div>
        </div>
      </div>
      <div className="relative py-12 lg:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl" style={{ color: "#cd413f" }}>Why Choose Local?</h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Supporting local businesses helps create jobs, boost the economy, and preserve the unique character of
                your community. Plus, local shops and eateries often offer high-quality products, personalized service,
                and one-of-a-kind experiences you won't find elsewhere.
              </p>
            </div>
            <div className="mx-auto flex items-center justify-center">
              <img
                alt="Image"
                className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                height="335"
                src="./images/placeholder.jpeg"
                width="600"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="py-12 lg:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl" style={{ color: "#f2c829" }}>Our Mission</h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                We're on a mission to connect people with the best local businesses. By making it simple to explore the
                diverse offerings in your neighborhood, we hope to inspire a greater appreciation for the places and
                faces that make your community special.
              </p>
            </div>
            <div className="grid gap-4">
              <h3 className="text-xl font-bold">Community is at the heart of our guiding principles,</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                and we have some simple criteria by which we manage our listings:
              </p>
              <ul className="list-none">
                <li className="flex items-center mb-2 border max-w-xl shadow-lg rounded-md">
                  <div className=" flex items-center">
                    <div className=" text-4xl p-3 bg-primary rounded-l-md text-white" style={{ backgroundColor: "#4f9ea8" }}>
                      <IoFastFoodOutline />
                    </div>
                    <p className=" pl-4">Food and/or drinks must be the primary offering.</p>
                  </div>
                </li>
                <li className="flex items-center mb-2 border max-w-xl shadow-lg rounded-md">
                  <div className=" flex items-center">
                    <div className=" text-4xl p-3 rounded-l-md bg-primary text-white" style={{ backgroundColor: "#cd413f" }}>
                      <MdOutlineTableRestaurant />
                    </div>
                    <p className=" pl-4">Must have a permanent physical location.</p>
                  </div>
                </li>
                <li className="flex items-center mb-2 border max-w-xl shadow-lg rounded-md">
                  <div className=" flex items-center">
                    <div className=" text-4xl p-3 rounded-l-md bg-primary text-white" style={{ backgroundColor: "#f2c829" }}>
                      <GiPokerHand />
                    </div>
                    <p className=" pl-4">Must NOT own, operate or derive financial gain from pokies.</p>
                  </div>
                </li>
                <li className="flex items-center mb-2 border max-w-xl shadow-lg rounded-md">
                  <div className=" flex items-center">
                    <div className=" text-4xl p-3 rounded-l-md bg-primary text-white" style={{ backgroundColor: "#eba55a" }}>
                      <LiaBuildingSolid />
                    </div>
                    <p className=" pl-4 text-sm md:text-base">Must NOT be publicly listed, a franchise, or majority foreign-owned.</p>
                  </div>
                </li>

              </ul>
              {/* <ul className="grid gap-2 py-4">
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  Cozy cafes with delicious coffee and pastries
                </li>
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  Charming boutiques selling unique fashion and gifts
                </li>
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  Family-owned restaurants serving mouthwatering meals
                </li>
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  Professional services like salons, spas, and more
                </li>
              </ul> */}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 py-12 lg:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-2 items-center text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl" style={{ color: "#eba55a" }}>
                Supporting Local, One Business at a Time
              </h2>
              <p className="max-w-[800px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Join the community of users who are discovering the best of local businesses. With our directory, you
                can make a positive impact while enjoying top-notch products and services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
