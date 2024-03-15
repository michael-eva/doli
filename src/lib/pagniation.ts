import { CardProps } from "../Types";

function paginatePage(currentPage: number, pageSize: number, filterPosts: CardProps[]) {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatePage = filterPosts.slice(startIndex, endIndex);
    return paginatePage;
}


export { paginatePage }