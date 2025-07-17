import { useEffect, useState, useCallback } from "react";
import { CardProps } from "@/Types";
import { useFilters } from "./filterFunctions";
import {
  getFilteredPostsWithPagination,
  getTotalPostCount,
} from "../Supabase/serverSideFiltering";
import { useDebounce } from "@/hooks/useDebounce";

export function useServerSideFiltering(
  isChecked: boolean,
  currentPage: number,
  pageSize: number
) {
  const [posts, setPosts] = useState<CardProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    deliveryFilter,
    locationFilter,
    decodedLocationFilter,
    searchFilter,
    decodedTypeFilter,
  } = useFilters();

  // Debounce the search filter to prevent excessive API calls
  const debouncedSearchFilter = useDebounce(searchFilter, 500); // 500ms delay

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getFilteredPostsWithPagination({
        typeFilter: decodedTypeFilter,
        searchFilter: debouncedSearchFilter, // Use debounced search filter
        deliveryFilter: deliveryFilter,
        locationFilter: locationFilter,
        coordinates: decodedLocationFilter,
        isChecked,
        currentPage,
        pageSize,
      });

      setPosts(result.posts);
      setTotalCount(result.totalCount);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error("Error fetching filtered posts:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setPosts([]);
      setTotalCount(0);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [
    decodedTypeFilter,
    debouncedSearchFilter, // Use debounced search filter
    deliveryFilter,
    locationFilter,
    decodedLocationFilter,
    isChecked,
    currentPage,
    pageSize,
  ]);

  // Fetch data when filters or pagination changes
  useEffect(() => {
    fetchData();
  }, [
    decodedTypeFilter,
    debouncedSearchFilter, // Use debounced search filter instead of searchFilter
    deliveryFilter,
    locationFilter,
    decodedLocationFilter,
    isChecked,
    currentPage,
    pageSize,
  ]);

  // Get total count for pagination display
  const getTotalCount = async () => {
    try {
      const count = await getTotalPostCount({
        typeFilter: decodedTypeFilter,
        searchFilter: debouncedSearchFilter, // Use debounced search filter
        deliveryFilter: deliveryFilter,
        locationFilter: locationFilter,
        coordinates: decodedLocationFilter,
        isChecked,
      });
      return count;
    } catch (err) {
      console.error("Error getting total count:", err);
      return 0;
    }
  };

  return {
    posts,
    totalCount,
    hasMore,
    isLoading,
    error,
    fetchData,
    getTotalCount,
    isSearchDebounced: searchFilter !== debouncedSearchFilter, // Indicates if search is being debounced
  };
}
