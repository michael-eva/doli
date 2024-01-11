import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid'
import { useState } from 'react';

type PaginationProps = {
    totalItems: number;
    pageSize: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ totalItems, pageSize, currentPage, onPageChange }: PaginationProps) {

    // export default function Pagination({ totalItems, pageSize, currentPage, onPageChange }) {
    const totalPages = Math.ceil(totalItems / pageSize);
    // const [currentPage, setCurrentPage] = useState<number>(0)
    console.log("Total pages:", totalPages);
    console.log(totalItems);


    const renderPageNumbers = () => {
        const pageNumbers = [];

        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <a
                    key={i}
                    href="#"
                    className={` cursor-pointer inline-flex items-center px-4 pt-4 text-sm font-medium ${currentPage === i ? 'cursor-default text-indigo-600 border-t-2 border-indigo-500' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:border-t-2'
                        } `}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </a>
            );
        }
        return pageNumbers

    }
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
            // console.log(page);
            // setCurrentPage(page)

        }
    };


    return (
        <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-5">
            <div className="-mt-px flex w-0 flex-1">
                <a
                    href="#"
                    className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    <ArrowLongLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                    Previous
                </a>
            </div>
            <div className="-mt-px flex">
                {renderPageNumbers()}
            </div>
            <div className="-mt-px flex w-0 flex-1 justify-end">
                <a
                    href="#"
                    className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                    <ArrowLongRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                </a>
            </div>
        </nav>
    )
}
