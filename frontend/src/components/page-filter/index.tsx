import { FILTER_TYPE } from "@/lib/constant";
import "./page-filter.scss";

const PageFilter = ({
  selectedFilter,
  setSelectedFilter,
  allLength,
  pendingLength,
  completedLength,
}: any) => {
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
    </div>
  );
};

export default PageFilter;
