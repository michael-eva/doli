import supabase from "@/config/supabaseClient";
import { CardProps } from "@/Types";

interface FilterParams {
  typeFilter?: string | null;
  searchFilter?: string | null;
  deliveryFilter?: string | null;
  locationFilter?: string | null;
  coordinates?: string | null;
  isChecked: boolean;
  currentPage: number;
  pageSize: number;
}

interface FilterResult {
  posts: CardProps[];
  totalCount: number;
  hasMore: boolean;
}

export async function getFilteredPostsWithPagination({
  typeFilter,
  searchFilter,
  deliveryFilter,
  locationFilter,
  coordinates,
  isChecked,
  currentPage,
  pageSize,
}: FilterParams): Promise<FilterResult> {
  try {
    // For coordinate-based filtering, we need a different approach
    // since we can't easily do geographic queries with pagination in Supabase
    if (isChecked && coordinates) {
      return await getCoordinateBasedPosts({
        typeFilter,
        searchFilter,
        deliveryFilter,
        coordinates,
        currentPage,
        pageSize,
      });
    }

    // Calculate pagination
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;

    // Start building the query
    let query = supabase
      .from("posts")
      .select(
        `
        *,
        locations (
          suburb,
          state,
          country,
          postcode,
          streetAddress,
          formatted_address,
          coordinates
        )
      `,
        { count: "exact" }
      )
      .eq("isVerified", true)
      .order("updated_at", { ascending: false });

    // Apply type filter
    if (typeFilter && typeFilter !== "all") {
      query = query.eq("type", typeFilter);
    }

    // Apply delivery method filter
    if (deliveryFilter && deliveryFilter !== "all") {
      query = query.eq(deliveryFilter, true);
    }

    // Apply search filter - search across multiple columns
    if (searchFilter && searchFilter.trim() !== "") {
      const searchTerm = searchFilter.trim();
      query = query.or(
        `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,type.ilike.%${searchTerm}%`
      );
    }

    // Apply location filter (postcode-based)
    if (!isChecked && locationFilter) {
      query = query.eq("locations.postcode", locationFilter);
    }

    // Apply pagination
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching filtered posts:", error);
      throw error;
    }

    // Process the data to match the expected format
    const processedPosts =
      data?.map((post) => ({
        ...post,
        selectedTags:
          typeof post.selectedTags === "string"
            ? JSON.parse(post.selectedTags)
            : post.selectedTags,
        openingHours:
          typeof post.openingHours === "string"
            ? JSON.parse(post.openingHours)
            : post.openingHours,
        locationData: post.locations?.[0] || null,
      })) || [];

    // Apply additional client-side filtering for fields that can't be easily searched in Supabase
    let finalPosts = processedPosts;
    if (searchFilter && searchFilter.trim() !== "") {
      const searchTerm = searchFilter.trim().toLowerCase();
      console.log("🔍 Searching for:", searchTerm);
      console.log("📊 Posts before search filtering:", processedPosts.length);

      finalPosts = processedPosts.filter((post) => {
        const columnsToSearch = ["description", "selectedTags", "type", "name"];

        // Check direct fields
        const directMatch = columnsToSearch.some((column) => {
          const value = post[column];

          if (Array.isArray(value)) {
            return value.some(
              (tag: any) =>
                typeof tag.label === "string" &&
                tag.label.toLowerCase().includes(searchTerm)
            );
          }

          return (
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm)
          );
        });

        // Check location fields
        const locationMatch =
          post.locationData &&
          (post.locationData.state?.toLowerCase().includes(searchTerm) ||
            post.locationData.suburb?.toLowerCase().includes(searchTerm) ||
            post.locationData.postcode?.toLowerCase().includes(searchTerm));

        return directMatch || locationMatch;
      });

      console.log("📊 Posts after search filtering:", finalPosts.length);
    }

    // If we have a search filter, we need to get the total count differently
    // since we're doing client-side filtering
    let totalCount = count || 0;
    if (searchFilter && searchFilter.trim() !== "") {
      // For search filtering, we need to fetch all posts and count the matches
      const allPostsQuery = supabase
        .from("posts")
        .select(
          `
          *,
          locations (
            suburb,
            state,
            country,
            postcode,
            streetAddress,
            formatted_address,
            coordinates
          )
        `
        )
        .eq("isVerified", true)
        .order("updated_at", { ascending: false });

      // Apply the same filters as above (except pagination)
      let filteredQuery = allPostsQuery;
      if (typeFilter && typeFilter !== "all") {
        filteredQuery = filteredQuery.eq("type", typeFilter);
      }

      if (deliveryFilter && deliveryFilter !== "all") {
        filteredQuery = filteredQuery.eq(deliveryFilter, true);
      }

      if (!isChecked && locationFilter) {
        filteredQuery = filteredQuery.eq("locations.postcode", locationFilter);
      }

      const { data: allPosts } = await filteredQuery;

      const processedAllPosts =
        allPosts?.map((post) => ({
          ...post,
          selectedTags:
            typeof post.selectedTags === "string"
              ? JSON.parse(post.selectedTags)
              : post.selectedTags,
          openingHours:
            typeof post.openingHours === "string"
              ? JSON.parse(post.openingHours)
              : post.openingHours,
          locationData: post.locations?.[0] || null,
        })) || [];

      const searchTerm = searchFilter.trim().toLowerCase();
      const totalFilteredPosts = processedAllPosts.filter((post) => {
        const columnsToSearch = ["description", "selectedTags", "type", "name"];

        // Check direct fields
        const directMatch = columnsToSearch.some((column) => {
          const value = post[column];

          if (Array.isArray(value)) {
            return value.some(
              (tag: any) =>
                typeof tag.label === "string" &&
                tag.label.toLowerCase().includes(searchTerm)
            );
          }

          return (
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm)
          );
        });

        // Check location fields
        const locationMatch =
          post.locationData &&
          (post.locationData.state?.toLowerCase().includes(searchTerm) ||
            post.locationData.suburb?.toLowerCase().includes(searchTerm) ||
            post.locationData.postcode?.toLowerCase().includes(searchTerm));

        return directMatch || locationMatch;
      });

      totalCount = totalFilteredPosts.length;
    }

    console.log("🔢 Pagination debug:", {
      totalCount,
      pageSize,
      from,
      to,
      finalPostsLength: finalPosts.length,
      hasMore: totalCount > from + pageSize,
      shouldShowPagination: totalCount > pageSize,
    });

    return {
      posts: finalPosts,
      totalCount: totalCount,
      hasMore: totalCount > from + pageSize,
    };
  } catch (error) {
    console.error("Error in getFilteredPostsWithPagination:", error);
    throw error;
  }
}

// Special function for coordinate-based filtering
async function getCoordinateBasedPosts({
  typeFilter,
  searchFilter,
  deliveryFilter,
  coordinates,
  currentPage,
  pageSize,
}: {
  typeFilter?: string | null;
  searchFilter?: string | null;
  deliveryFilter?: string | null;
  coordinates: string;
  currentPage: number;
  pageSize: number;
}): Promise<FilterResult> {
  try {
    // First, get all posts with the basic filters (without pagination)
    let query = supabase
      .from("posts")
      .select(
        `
        *,
        locations (
          suburb,
          state,
          country,
          postcode,
          streetAddress,
          formatted_address,
          coordinates
        )
      `
      )
      .eq("isVerified", true)
      .order("updated_at", { ascending: false });

    // Apply type filter
    if (typeFilter && typeFilter !== "all") {
      query = query.eq("type", typeFilter);
    }

    // Apply delivery method filter
    if (deliveryFilter && deliveryFilter !== "all") {
      query = query.eq(deliveryFilter, true);
    }

    // Apply search filter
    if (searchFilter && searchFilter.trim() !== "") {
      const searchTerm = searchFilter.trim();
      query = query.or(
        `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,type.ilike.%${searchTerm}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching posts for coordinate filtering:", error);
      throw error;
    }

    // Process the data
    const processedPosts =
      data?.map((post) => ({
        ...post,
        selectedTags:
          typeof post.selectedTags === "string"
            ? JSON.parse(post.selectedTags)
            : post.selectedTags,
        openingHours:
          typeof post.openingHours === "string"
            ? JSON.parse(post.openingHours)
            : post.openingHours,
        locationData: post.locations?.[0] || null,
      })) || [];

    // Apply additional client-side filtering for search
    let searchFilteredPosts = processedPosts;
    if (searchFilter && searchFilter.trim() !== "") {
      const searchTerm = searchFilter.trim().toLowerCase();
      console.log("🔍 [Coordinate] Searching for:", searchTerm);
      console.log(
        "📊 [Coordinate] Posts before search filtering:",
        processedPosts.length
      );

      searchFilteredPosts = processedPosts.filter((post) => {
        const columnsToSearch = ["description", "selectedTags", "type", "name"];

        // Check direct fields
        const directMatch = columnsToSearch.some((column) => {
          const value = post[column];

          if (Array.isArray(value)) {
            return value.some(
              (tag: any) =>
                typeof tag.label === "string" &&
                tag.label.toLowerCase().includes(searchTerm)
            );
          }

          return (
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm)
          );
        });

        // Check location fields
        const locationMatch =
          post.locationData &&
          (post.locationData.state?.toLowerCase().includes(searchTerm) ||
            post.locationData.suburb?.toLowerCase().includes(searchTerm) ||
            post.locationData.postcode?.toLowerCase().includes(searchTerm));

        return directMatch || locationMatch;
      });

      console.log(
        "📊 [Coordinate] Posts after search filtering:",
        searchFilteredPosts.length
      );
    }

    // Filter by coordinates
    const [latitude, longitude] = coordinates.split("+");
    const coordinateFilteredPosts = searchFilteredPosts.filter((post) => {
      if (!post.locationData?.coordinates) return false;

      const distance = calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        post.locationData.coordinates.latitude,
        post.locationData.coordinates.longitude
      );

      return distance <= 5; // 5km radius
    });

    // Apply pagination to the filtered results
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize;
    const paginatedPosts = coordinateFilteredPosts.slice(from, to);

    console.log("🔢 [Coordinate] Pagination debug:", {
      totalCount: coordinateFilteredPosts.length,
      pageSize,
      from,
      to,
      paginatedPostsLength: paginatedPosts.length,
      hasMore: coordinateFilteredPosts.length > to,
      shouldShowPagination: coordinateFilteredPosts.length > pageSize,
    });

    return {
      posts: paginatedPosts,
      totalCount: coordinateFilteredPosts.length,
      hasMore: coordinateFilteredPosts.length > to,
    };
  } catch (error) {
    console.error("Error in getCoordinateBasedPosts:", error);
    throw error;
  }
}

// Helper function to calculate distance between two points
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get total count for pagination without fetching all data
export async function getTotalPostCount(
  filters: Omit<FilterParams, "currentPage" | "pageSize">
): Promise<number> {
  try {
    // For coordinate-based filtering or when search filter is applied,
    // we need to get the actual filtered count since we do client-side filtering
    if (
      (filters.isChecked && filters.coordinates) ||
      (filters.searchFilter && filters.searchFilter.trim() !== "")
    ) {
      if (filters.isChecked && filters.coordinates) {
        const result = await getCoordinateBasedPosts({
          typeFilter: filters.typeFilter,
          searchFilter: filters.searchFilter,
          deliveryFilter: filters.deliveryFilter,
          coordinates: filters.coordinates,
          currentPage: 1,
          pageSize: 1000, // Get a large number to count all
        });
        return result.totalCount;
      } else {
        // For search-only filtering, we need to fetch and filter client-side
        const result = await getFilteredPostsWithPagination({
          ...filters,
          currentPage: 1,
          pageSize: 1000, // Get a large number to count all
        });
        return result.totalCount;
      }
    }

    let query = supabase
      .from("posts")
      .select("postId", { count: "exact" })
      .eq("isVerified", true);

    // Apply the same filters as above
    if (filters.typeFilter && filters.typeFilter !== "all") {
      query = query.eq("type", filters.typeFilter);
    }

    if (filters.deliveryFilter && filters.deliveryFilter !== "all") {
      query = query.eq(filters.deliveryFilter, true);
    }

    if (!filters.isChecked && filters.locationFilter) {
      query = query.eq("locations.postcode", filters.locationFilter);
    }

    const { count, error } = await query;

    if (error) {
      console.error("Error getting total count:", error);
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error("Error in getTotalPostCount:", error);
    throw error;
  }
}
