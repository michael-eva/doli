import { CardProps } from "../Types";
import { isCoordinateWithinRadius } from "../components/Location/locationHelpers";
import { paginatePage } from "@/lib/pagniation";
const containsSearchText = (text: string, searchTerm: string) =>
    text.toLowerCase().includes(searchTerm.toLowerCase());
    
function filterOrders(posts: CardProps[], typeFilter: string | null | undefined, deliveryFilter: string | null, isChecked: boolean, locationFilter: string | null, nearbyFilter: string | null, searchFilter: string | undefined, currentPage: number, pageSize: number) {
    let filterPosts = [...posts];

    if (typeFilter && typeFilter !== "all") {
        filterPosts = filterPosts.filter((post) => post.type === typeFilter);
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

    if (isChecked && nearbyFilter) {
        const [latitude, longitude] = nearbyFilter.split('+')
        filterPosts = filterPosts.filter((post) =>
            isCoordinateWithinRadius(
                { latitude: post.locationData?.coordinates?.latitude, longitude: post.locationData?.coordinates?.longitude },
                { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
                5000
            )

        );
    }
    if (searchFilter && searchFilter.trim() !== "") {
        filterPosts = filterPosts.filter((post) => {
            const columnsToSearch = ["description", "selectedTags", "type", "state", "suburb", "name"];

            return columnsToSearch.some((column) => {
                const value = post[column];

                if (Array.isArray(value)) {
                    return value.some(
                        (tag: any) =>
                            typeof tag.label === "string" &&
                            containsSearchText(tag.label, searchFilter)
                    );
                }

                return typeof value === "string" && containsSearchText(value, searchFilter);
            });
        });
    }

    return { filterPosts, paginatePageVar: paginatePage(currentPage, pageSize, filterPosts) }
};

export { filterOrders }