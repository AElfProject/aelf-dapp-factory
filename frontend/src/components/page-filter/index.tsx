import { FILTER_TYPE } from "@/lib/constant";
import "./page-filter.scss";

interface IPageFilter {
  selectedFilter: string,
  setSelectedFilter: (type: string) => void,
  allLength: number,
  pendingLength: number,
  completedLength: number,
  removedLength: number
}

const PageFilter = ({
  selectedFilter,
  setSelectedFilter,
  allLength,
  pendingLength,
  completedLength,
  removedLength
}: IPageFilter) => {
  return (
    <div className="filter-wrapper">
      <span
        className={selectedFilter === FILTER_TYPE.all ? "active" : ""}
        onClick={() => setSelectedFilter(FILTER_TYPE.all)}
      >
        All ({allLength})
      </span>
      <span
        className={selectedFilter === FILTER_TYPE.pending ? "active" : ""}
        onClick={() => setSelectedFilter(FILTER_TYPE.pending)}
      >
        Pending ({pendingLength})
      </span>
      <span
        className={selectedFilter === FILTER_TYPE.completed ? "active" : ""}
        onClick={() => setSelectedFilter(FILTER_TYPE.completed)}
      >
        Completed ({completedLength})
      </span>
      <span
        className={selectedFilter === FILTER_TYPE.removed ? "active" : ""}
        onClick={() => setSelectedFilter(FILTER_TYPE.removed)}
      >
        Removed ({removedLength})
      </span>
    </div>
  );
};

export default PageFilter;
