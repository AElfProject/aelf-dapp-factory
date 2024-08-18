import { DateIcons } from "../ui/icons";
import { calculateTimeRemaining } from "@/lib/utils";
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
  onDeleteTaskHandle: (id: string) => void;
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

  return (
    <div className={"todo-card"} key={index}>
      <div className="info">
        <p className="title">{data.name}</p>
        <p className="desc">{data.description}</p>
        <div className="date">
          <DateIcons />
          <p>{calculateTimeRemaining(data.updatedAt)}</p>
        </div>
      </div>
      <div className="right-container">
        <div className="tags-wrapper">
          <span>{data.category}</span>
        </div>
        <div className="action-container">
          {!isTaskCompleted && (
            <Button onClick={() => onEditTaskHandle(data)}>Edit</Button>
          )}
          <Button
            className={`complete ${isTaskCompleted ? "active" : ""}`}
            disabled={updateId === data.taskId}
            onClick={() => !isTaskCompleted && onCompleteTaskHandle(data)}
          >
            {isTaskCompleted ? "Completed" : "Complete"}
          </Button>
          <Button
            className="error-btn"
            disabled={deletingId === data.taskId}
            onClick={() => onDeleteTaskHandle(data.taskId)}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
