import { useEffect, useMemo, useState } from "react";
import { IPortkeyProvider } from "@portkey/provider-types";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Select from "react-select";
import { Id, toast } from "react-toastify";

import "./home.scss";
import { Button } from "@/components/ui/button";
import { CATEGORY_OPTIONS, FILTER_TYPE, TASK_STATUS } from "@/lib/constant";
import Modal from "@/components/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@/components/ui/icons";
import { removeNotification } from "@/lib/utils";
import useTodoSmartContract from "@/hooks/useTodoSmartContract";
import PageFilter from "@/components/page-filter";
import TodoCard from "@/components/todo-card";

interface ITodoObject {
  name: string;
  description: string;
  category: string;
  createdAt: string;
  status: string;
  taskId: string;
  updatedAt: string;
}

type Option = {
  value: string;
  label: string;
};

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

const HomePage = ({
  provider,
  currentWalletAddress,
}: {
  provider: IPortkeyProvider | null;
  currentWalletAddress?: string;
}) => {
  const smartContract = useTodoSmartContract(provider);

  const [todoData, setTodoData] = useState<ITodoObject[] | []>([]);
  const [updateId, setUpdateId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Option | null>();
  const [selectedFilter, setSelectedFilter] = useState<string>(FILTER_TYPE.all);

  const [isContractInitialized, setIsContractInitialized] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const pendingTask = useMemo(() => {
    if (todoData.length === 0) {
      return todoData;
    }
    return todoData.filter(
      (data: ITodoObject) => data.status.toLowerCase() === TASK_STATUS.pending
    );
  }, [todoData, selectedFilter, updateId]);

  const completedTask = useMemo(() => {
    if (todoData.length === 0) {
      return todoData;
    }
    return todoData.filter(
      (data: ITodoObject) => data.status.toLowerCase() === TASK_STATUS.completed
    );
  }, [todoData, selectedFilter, updateId]);

  const filteredTask = useMemo(() => {
    return selectedFilter === TASK_STATUS.pending
      ? pendingTask
      : selectedFilter === TASK_STATUS.completed
      ? completedTask
      : todoData;
  }, [selectedFilter, completedTask, pendingTask]);

  const handleCloseModal = () => {
    form.reset();
    setIsModalOpen(false);
    setUpdateId(null);
    setSelectedCategory(null);
  };

  // get Todo Data from User's wallet using contract
  const getTodoData = async () => {
    try {
      const result = await smartContract?.callViewMethod("ListTasks", "");
      console.log("result", result?.data.tasks);
      setTodoData(result?.data.tasks || []);
    } catch (error) {
      console.log("error======", error);
    } finally {
      setLoading(false);
    }
  };

  const initializeContract = async () => {
    let initializeLoadingId;
    try {
      initializeLoadingId = toast.loading("Initializing a Contract..");
      await smartContract?.callSendMethod(
        "Initialize",
        currentWalletAddress as string,
        {}
      );
      toast.update(initializeLoadingId, {
        render: "Contract Successfully Initialized",
        type: "success",
        isLoading: false,
      });
    } catch (error: any) {
      toast.update(initializeLoadingId as Id, {
        render: error.message,
        type: "error",
        isLoading: false,
      });
    } finally {
      removeNotification(initializeLoadingId as Id);
    }
  };

  const checkIsContractInitialized = async () => {
    const result = await smartContract?.callViewMethod("GetInitialStatus", "");
    setIsContractInitialized(result?.data.value);
  };

  // Check whether contract initialized or not
  useEffect(() => {
    checkIsContractInitialized();
  }, []);

  // Use Effect to Fetch NFTs
  useEffect(() => {
    if (currentWalletAddress) {
      getTodoData();
    }
  }, [currentWalletAddress]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createNewTask = async (values: {
    name: string;
    description: string;
  }) => {
    let createLoadingId;
    try {
      createLoadingId = toast.loading("Creating a New Task..");
      setFormLoading(true);
      const sendData = {
        name: values.name,
        description: values.description,
        category: selectedCategory?.value,
        status: TASK_STATUS.pending,
      };
      console.log("create task with this data", sendData);
      await smartContract?.callSendMethod(
        "CreateTask",
        currentWalletAddress as string,
        sendData
      );
      toast.update(createLoadingId, {
        render: "New Task Successfully Created",
        type: "success",
        isLoading: false,
      });
      setIsModalOpen(false);
      getTodoData();
    } catch (error: any) {
      console.log("error======", error);
      toast.update(createLoadingId as Id, {
        render: error.message,
        type: "error",
        isLoading: false,
      });
    } finally {
      setFormLoading(false);
      removeNotification(createLoadingId as Id);
    }
  };

  const updateTask = async (values: { name: string; description: string }) => {
    let updateLoadingId;
    try {
      updateLoadingId = toast.loading("Updating a Task..");
      setFormLoading(true);
      const sendData = {
        taskId: updateId,
        name: values.name,
        description: values.description,
        category: selectedCategory?.value,
        status: TASK_STATUS.pending,
      };
      console.log("create task with this data", sendData);
      await smartContract?.callSendMethod(
        "UpdateTask",
        currentWalletAddress as string,
        sendData
      );
      toast.update(updateLoadingId, {
        render: "Task Successfully Updated",
        type: "success",
        isLoading: false,
      });
      setIsModalOpen(false);
      getTodoData();
    } catch (error: any) {
      console.log("error======", error);
      toast.update(updateLoadingId as Id, {
        render: error.message,
        type: "error",
        isLoading: false,
      });
    } finally {
      setFormLoading(false);
      removeNotification(updateLoadingId as Id);
    }
  };

  const deleteTask = async (deleteId: string) => {
    let deleteLoadingId;
    try {
      deleteLoadingId = toast.loading("Removing a Task..");
      setDeletingId(deleteId);
      await smartContract?.callSendMethod(
        "DeleteTask",
        currentWalletAddress as string,
        { value: deleteId }
      );
      toast.update(deleteLoadingId, {
        render: "Task Successfully Removed",
        type: "success",
        isLoading: false,
      });
      setIsModalOpen(false);
      await getTodoData();
    } catch (error: any) {
      console.log("error======", error);
      toast.update(deleteLoadingId as Id, {
        render: error.message,
        type: "error",
        isLoading: false,
      });
    } finally {
      setDeletingId(null);
      removeNotification(deleteLoadingId as Id);
    }
  };

  const completeTask = async (data: ITodoObject) => {
    let completeLoadingId;
    try {
      completeLoadingId = toast.loading("Moving to Completed Task..");
      setUpdateId(data.taskId);
      await smartContract?.callSendMethod(
        "UpdateTask",
        currentWalletAddress as string,
        { ...data, status: TASK_STATUS.completed }
      );
      toast.update(completeLoadingId, {
        render: "Task Moved to Completed",
        type: "success",
        isLoading: false,
      });
      setIsModalOpen(false);
      await getTodoData();
    } catch (error: any) {
      console.log("error======", error);
      toast.update(completeLoadingId as Id, {
        render: error.message,
        type: "error",
        isLoading: false,
      });
    } finally {
      setUpdateId(null);
      removeNotification(completeLoadingId as Id);
    }
  };

  const onSubmit = async (values: { name: string; description: string }) => {
    if (isContractInitialized !== true) {
      await initializeContract();
    }
    if (!!updateId) {
      await updateTask(values);
    } else {
      await createNewTask(values);
    }
  };

  const onEditHandle = (data: ITodoObject) => {
    setUpdateId(data.taskId);
    form.setValue("name", data.name);
    form.setValue("description", data.description);
    setSelectedCategory({
      label: data.category.charAt(0).toUpperCase() + data.category.slice(1),
      value: data.category,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="home-container">
      <div className="todo-collection-container">
        <div className="todo-collection-head">
          <h2>All Tasks</h2>
          <div className="button-wrapper">
            <Button
              className="header-button"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusIcon />
              Add New
            </Button>
          </div>
        </div>
        <PageFilter
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          allLength={todoData.length}
          pendingLength={pendingTask.length}
          completedLength={completedTask.length}
        />
        <Modal
          isVisible={isModalOpen}
          title={(updateId ? "Update" : "Create New") + " Task"}
          onClose={handleCloseModal}
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 modal-form"
            >
              <div className="input-group">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Token Name" {...field} />
                      </FormControl>
                      <FormMessage className="error-message" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="input-group">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Symbol" {...field} />
                      </FormControl>
                      <FormMessage className="error-message" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="select-container">
                <label>Select Types</label>
                <Select
                  value={selectedCategory}
                  options={CATEGORY_OPTIONS}
                  //@ts-ignore
                  onChange={(opt: Option) => setSelectedCategory(opt)}
                  placeholder="Select Category"
                />
              </div>
              <div className="button-container">
                <Button
                  type="submit"
                  className="submit-btn"
                  disabled={formLoading}
                >
                  {!!updateId ? "Update" : "Create New"} Task
                </Button>
              </div>
            </form>
          </Form>
        </Modal>

        {currentWalletAddress ? (
          <div className="todo-collection">
            {filteredTask.length > 0 ? (
              filteredTask.slice(0, 5).map((data: ITodoObject, index) => {
                return (
                  <TodoCard
                    data={data}
                    index={index}
                    onEditTaskHandle={onEditHandle}
                    onCompleteTaskHandle={completeTask}
                    onDeleteTaskHandle={deleteTask}
                    updateId={updateId}
                    deletingId={deletingId}
                  />
                );
              })
            ) : loading ? (
              <div className="bordered-container">
                <strong>Loading...</strong>
              </div>
            ) : (
              <div className="bordered-container">
                <strong>
                  It's Look like you haven't created any Todo Item yet
                </strong>
              </div>
            )}
          </div>
        ) : (
          <div className="bordered-container">
            <strong>
              Please connect your Portkey Wallet and Create a new Todo List.
            </strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
