using System.Collections.Generic;

namespace AElf.Contracts.ToDo
{
    public class ToDo : ToDoContainer.ToDoBase
    {
        public override Empty Initialize(Empty input)
        {
            if (State.Initialized.Value)
            {
                return new Empty();
            }

            State.Initialized.Value = true;
            State.Owner.Value = Context.Sender;
            State.TaskIds.Value = ""; // Initialize empty string for task IDs
            State.TaskCounter.Value = 0; // Initialize task counter

            return new Empty();
        }

        public override StringValue CreateTask(TaskInput input)
        {
            if (!State.Initialized.Value)
            {
                // Handle uninitialized state
                return new StringValue { Value = "Contract not initialized." };
            }

            var taskId = (State.TaskCounter.Value + 1).ToString();
            State.TaskCounter.Value++;

            var timestamp = Context.CurrentBlockTime.Seconds;

            var task = new CustomTask
            {
                Name = input.Name,
                Description = input.Description,
                Category = input.Category,
                Status = "Pending",
                CreatedAt = timestamp,
                UpdatedAt = timestamp
            };

            State.Tasks[taskId] = task;
            State.TaskExistence[taskId] = true; // Mark task as existing

            // Append task ID to the list of IDs
            var existingTaskIds = State.TaskIds.Value;
            if (!string.IsNullOrEmpty(existingTaskIds))
            {
                existingTaskIds += ",";
            }
            existingTaskIds += taskId;
            State.TaskIds.Value = existingTaskIds;

            return new StringValue { Value = taskId };
        }

        public override Empty UpdateTask(TaskUpdateInput input)
        {
            var task = State.Tasks[input.TaskId];
            task.Name = input.Name ?? task.Name;
            task.Description = input.Description ?? task.Description;
            task.Category = input.Category ?? task.Category;
            task.Status = input.Status ?? task.Status;
            task.UpdatedAt = Context.CurrentBlockTime.Seconds;

            State.Tasks[input.TaskId] = task;

            return new Empty();
        }

        public override Empty DeleteTask(StringValue input)
        {

            State.Tasks.Remove(input.Value);
            State.TaskExistence.Remove(input.Value); // Remove task existence record

            // Remove task ID from the list of IDs
            var existingTaskIds = State.TaskIds.Value.Split(',');
            var newTaskIds = new List<string>();
            foreach (var taskId in existingTaskIds)
            {
                if (taskId != input.Value)
                {
                    newTaskIds.Add(taskId);
                }
            }
            State.TaskIds.Value = string.Join(",", newTaskIds);

            return new Empty();
        }

        public override TaskList ListTasks(Empty input)
        {
            var taskList = new TaskList();
            var taskIds = State.TaskIds.Value.Split(',');

            foreach (var taskId in taskIds)
            {
                var task = State.Tasks[taskId];
                if (task != null)
                {
                    taskList.Tasks.Add(new Task
                    {
                        TaskId = taskId,
                        Name = task.Name,
                        Description = task.Description,
                        Category = task.Category,
                        Status = task.Status,
                        CreatedAt = task.CreatedAt,
                        UpdatedAt = task.UpdatedAt
                    });
                }
            }

            return taskList;
        }

        public override Task GetTask(StringValue input)
        {
            var customTask = State.Tasks[input.Value];
            if (customTask == null)
            {
                // Handle task not found
                return new Task { TaskId = input.Value, Name = "Task not found." };
            }

            return new Task
            {
                TaskId = input.Value,
                Name = customTask.Name,
                Description = customTask.Description,
                Category = customTask.Category,
                Status = customTask.Status,
                CreatedAt = customTask.CreatedAt,
                UpdatedAt = customTask.UpdatedAt
            };
        }
    }
}
