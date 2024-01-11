import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid'

type PaginationProps = {
    totalItems: number;
    pageSize: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ totalItems, pageSize, currentPage, onPageChange }: PaginationProps) {
    const totalPages = Math.ceil(totalItems / pageSize);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 3;

        // Calculate the start and end pages based on the current page
        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(currentPage + 1, totalPages);

        // Ensure that there are always 3 pages displayed, adjusting start/end as needed
        if (endPage - startPage + 1 < maxPagesToShow) {
            if (currentPage === totalPages) {
                // If on the last page, show the last 3 pages
                startPage = Math.max(1, totalPages - maxPagesToShow + 1);
            } else {
                // If not on the last page, show the first 3 pages
                endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
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

        return pageNumbers;
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <>
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
            <p className="text-center mt-2 text-gray-500 text-sm">Page {currentPage} of {totalPages}</p>

        </>
    )
}
