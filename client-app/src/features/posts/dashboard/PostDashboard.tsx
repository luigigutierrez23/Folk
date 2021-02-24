import React, { useEffect, useState } from "react";
import { Grid, Loader } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";

import PostList from "./PostList";
import PostFilters from "./PostFilters";
import { PagingParams } from "../../../app/models/pagination";
import InfiniteScroll from "react-infinite-scroller";
import PostListItemPlaceholder from "./PostListItemPlaceholder";

export default observer(function PostDashboard() {
  const {
    postStore: {
      loadPosts,
      postRegistry,
      loadingInitial,
      setPagingParams,
      pagination,
    },
  } = useStore();
  const [loadingNext, setLoadingNext] = useState(false);

  function handleGetNext() {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage + 1));
    loadPosts().then(() => setLoadingNext(false));
  }

  useEffect(() => {
    if (postRegistry.size <= 1) loadPosts();
  }, [postRegistry.size, loadPosts]);

  return (
    <Grid>
      <Grid.Column width={10}>
        {loadingInitial && !loadingNext ? (
          <>
            <PostListItemPlaceholder />
            <PostListItemPlaceholder />
          </>
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={
              !loadingNext &&
              !!pagination &&
              pagination.currentPage < pagination.totalPages
            }
            initialLoad={false}
          >
            <PostList />
          </InfiniteScroll>
        )}
      </Grid.Column>
      <Grid.Column width={6}>
        <PostFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
});
