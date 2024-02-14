import { CardProps } from "../Types";

function paginatePage(currentPage: number, pageSize: number, filterPosts: CardProps[]) {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatePage = filterPosts.slice(startIndex, endIndex);
    // console.log("paginate page:", paginatePage);
    console.log("filter posts:", filterPosts);
    console.log("end index:", endIndex);
    console.log("current page", currentPage);



    return paginatePage;
}


export { paginatePage }