import { CardProps } from "../Types";
import { isCoordinateWithinRadius } from "../components/Location/locationHelpers";
import { paginatePage } from "./pagniation";
const containsSearchText = (text: string, searchTerm: string) =>
    text.toLowerCase().includes(searchTerm.toLowerCase());
    
function filterOrders(posts: CardProps[], decodedTypeFilter: string | null | undefined, deliveryFilter: string | null, isChecked: boolean, locationFilter: string | null, decodedLocationFilter: string | null, decodedSearchFilter: string | null, currentPage: number, pageSize: number) {
    let filterPosts = [...posts];

    if (decodedTypeFilter && decodedTypeFilter !== "all") {
        filterPosts = filterPosts.filter((post) => post.type === decodedTypeFilter);
    }
    if (deliveryFilter && deliveryFilter !== "all") {
        filterPosts = filterPosts.filter(post => post[deliveryFilter] === true)
    }
    if (!isChecked && locationFilter) {
        const lowercaseLocationFilter = locationFilter.toLowerCase();
        filterPosts = filterPosts.filter((post) => {
            const lowercaseSuburb = post?.locationData?.postcode?.toLowerCase();
            return lowercaseSuburb && lowercaseSuburb.includes(lowercaseLocationFilter);
        });
    }

    if (isChecked && decodedLocationFilter) {
        console.log("hello");
        
        const [latitude, longitude] = decodedLocationFilter.split('+')
        filterPosts = filterPosts.filter((post) =>
            isCoordinateWithinRadius(
                { latitude: post.locationData?.coordinates?.latitude, longitude: post.locationData?.coordinates?.longitude },
                { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
                5000
            )

        );
    }
    if (decodedSearchFilter && decodedSearchFilter.trim() !== "") {
        console.log("hello");
        
        filterPosts = filterPosts.filter((post) => {
            const columnsToSearch = ["description", "selectedTags", "type", "state", "suburb", "name"];

            return columnsToSearch.some((column) => {
                const value = post[column];

                if (Array.isArray(value)) {
                    return value.some(
                        (tag: any) =>
                            typeof tag.label === "string" &&
                            containsSearchText(tag.label, decodedSearchFilter)
                    );
                }

                return typeof value === "string" && containsSearchText(value, decodedSearchFilter);
            });
        });
    }

    return { filterPosts, paginatePageVar: paginatePage(currentPage, pageSize, filterPosts) }
};

export { filterOrders }