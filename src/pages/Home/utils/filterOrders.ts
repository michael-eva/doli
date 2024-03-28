import { CardProps } from "../../../Types";
import { isCoordinateWithinRadius } from "../../../components/Location/locationHelpers";
import { paginatePage } from "@/pages/Home/utils/pagniation";
import { useFilters } from "./filterFunctions";
import { useEffect, useState } from "react";
import { fetchCombinedData } from "./fetchCombinedData";
const containsSearchText = (text: string, searchTerm: string) =>
    text.toLowerCase().includes(searchTerm.toLowerCase());

export function filterOrders( isChecked: boolean, currentPage: number, pageSize: number) {
    const [posts, setPosts] = useState<CardProps[]>()
    const {deliveryFilter, locationFilter, decodedLocationFilter, searchFilter, decodedTypeFilter} = useFilters()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const fetchData = async () => {
        setIsLoading(true); // Set loading state to true before fetching data
        const mergedData = await fetchCombinedData();
        if (mergedData) {
            setPosts(mergedData);
        }
        setIsLoading(false); // Set loading state to false after fetching data
    };
    useEffect(() => {

        fetchData();
    }, []);
    
    let filterPosts = [...posts|| []];


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
        const [latitude, longitude] = decodedLocationFilter.split('+')
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

    return { filterPosts, paginatePageVar: paginatePage(currentPage, pageSize, filterPosts), isLoading, fetchData }
};