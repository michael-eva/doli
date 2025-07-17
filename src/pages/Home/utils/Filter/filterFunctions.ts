import { useSearchParams } from "react-router-dom";

// const { filterPosts, paginatePageVar } = filterOrders(posts, decodedTypeFilter, deliveryFilter, isChecked, locationFilter, decodedLocationFilter, decodedSearchFilter, currentPage, pageSize)
// const isFilter = typeFilter || searchFilter || deliveryFilter || locationFilter || nearbyFilter ? true : false
export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const typeFilter = searchParams.get("type");
  const searchFilter = searchParams.get("search");
  const locationFilter = searchParams.get("location");
  const nearbyFilter = searchParams.get("coordinates");
  const deliveryFilter = searchParams.get("deliveryMethod");
  const decodedTypeFilter = typeFilter ? decodeURIComponent(typeFilter) : null;
  const decodedSearchFilter = searchFilter
    ? decodeURIComponent(searchFilter)
    : null;
  const decodedLocationFilter = nearbyFilter
    ? decodeURIComponent(nearbyFilter)
    : null;
  const genNewSearchParams = (key: string, value: string | null) => {
    const sp = new URLSearchParams(searchParams);
    if (value === null) {
      sp.delete(key);
    } else {
      sp.set(key, value); // Don't encode the key, and value is already properly handled by URLSearchParams
    }
    setSearchParams(`?${sp.toString()}`);
    // setCurrentPage(1)
  };

  const clearAllFilters = () => {
    setSearchParams(""); // Clear all URL parameters
  };

  return {
    decodedTypeFilter,
    deliveryFilter,
    locationFilter,
    decodedLocationFilter,
    decodedSearchFilter,
    typeFilter,
    searchFilter,
    nearbyFilter,
    genNewSearchParams,
    clearAllFilters,
  };
}

export function isFilterApplied() {
  const {
    deliveryFilter,
    locationFilter,
    typeFilter,
    searchFilter,
    nearbyFilter,
  } = useFilters();
  if (
    (typeFilter && typeFilter !== "all") ||
    searchFilter ||
    deliveryFilter ||
    locationFilter ||
    nearbyFilter
  ) {
    return true;
  } else return false;
}
