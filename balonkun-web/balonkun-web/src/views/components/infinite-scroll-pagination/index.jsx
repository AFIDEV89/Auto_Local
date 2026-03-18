import { useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

function InfiniteScrollPagination({ children, items, fetchData, hasMore }) {
	const refresh = useCallback(() => fetchData(), [fetchData]);

	return (
		<InfiniteScroll
			style={{ boxShadow: "8px 20px 40px rgba(49, 32, 138, 0.09), -8px -20px 40px rgba(49, 32, 138, 0.09)" }}
			dataLength={items.list.length} //This is important field to render the next data
			next={() => {
				fetchData();
			}}
			hasMore={hasMore}
			refreshFunction={refresh}
			pullDownToRefresh
			pullDownToRefreshThreshold={50}
			pullDownToRefreshContent={
				<h3 style={{ textAlign: 'center' }}># 8595; Pull down to refresh</h3>
			}
			releaseToRefreshContent={
				<h3 style={{ textAlign: 'center' }}># 8593; Release to refresh</h3>
			}
		>
			{children}
		</InfiniteScroll>
	);
}

export default InfiniteScrollPagination;
