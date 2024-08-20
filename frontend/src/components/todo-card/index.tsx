import { ClockIcon, DateIcons } from "../ui/icons";
import { calculateTimeRemaining, dateFormat } from "@/lib/utils";
import { TASK_STATUS } from "@/lib/constant";
import { Button } from "../ui/button";
import "./todo-card.scss";

interface ITodoObject {
  name: string;
  description: string;
  category: string;
  createdAt: string;
  status: string;
  taskId: string;
  updatedAt: string;
}

interface IProps {
  data: ITodoObject;
  index: number;
  onEditTaskHandle: (data: ITodoObject) => void;
  onCompleteTaskHandle: (data: ITodoObject) => void;
  onDeleteTaskHandle: (deleteTask: ITodoObject) => void;
  updateId: string | null;
  deletingId: string | null;
}

const TodoCard = ({
  data,
  index,
  onEditTaskHandle,
  onCompleteTaskHandle,
  onDeleteTaskHandle,
  updateId,
  deletingId,
}: IProps) => {
  const isTaskCompleted = data.status === TASK_STATUS.completed;
  const isTaskRemoved = data.status === TASK_STATUS.removed;
  return (
    <div className={"todo-card"} key={index}>
      <div className="info">
        <p className="title">{data.name}</p>
        <p className="desc">{data.description}</p>
        <div className="date-and-time-container">
        <div className="date" data-tooltip="Updated Time">
          <ClockIcon />
          <p>{calculateTimeRemaining(data.updatedAt)}</p>
        </div>
        <div className="date" data-tooltip="Created Date and Time">
          <DateIcons />
          <p>{dateFormat(data.createdAt)}</p>
        </div>
        </div>
      </div>
      <div className="right-container">
        <div className="tags-wrapper">
          <span>{data.category}</span>
        </div>
        <div className="action-container">
          {!isTaskCompleted && !isTaskRemoved && (
            <Button onClick={() => onEditTaskHandle(data)}>Edit</Button>
          )}
          {!isTaskRemoved && <Button
            className={`complete ${isTaskCompleted ? "active" : ""}`}
            disabled={updateId === data.taskId}
            onClick={() => !isTaskCompleted && onCompleteTaskHandle(data)}
          >
            {isTaskCompleted ? "Completed" : "Complete"}
          </Button>}
          <Button
            className={`error-btn ${isTaskRemoved ? "active" : ""}`}
            disabled={deletingId === data.taskId}
            onClick={() => !isTaskRemoved && onDeleteTaskHandle(data)}
          >
            {isTaskRemoved ? "Removed" : "Remove"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
