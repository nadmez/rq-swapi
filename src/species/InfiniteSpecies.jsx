import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";
import { useInfiniteQuery } from "@tanstack/react-query";

const initialUrl = "https://swapi.py4e.com/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError,
    error,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["infinite-species"],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.next || undefined;
    },
  });

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (isError) {
    return <div className="error">{error.message}</div>;
  }

  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}

      <InfiniteScroll
        initialLoad={false}
        loadMore={() => {
          if (!isFetching) fetchNextPage();
        }}
        hasMore={hasNextPage}
      >
        {data?.pages?.map((page, pageIndex) => (
          <div key={pageIndex}>
            {page.results.map((species) => (
              <Species key={species.name + "_" + pageIndex} {...species} />
            ))}
          </div>
        ))}
      </InfiniteScroll>
    </>
  );
}
