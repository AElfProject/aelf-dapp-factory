import { useEffect, useState } from "react";
import { IPortkeyProvider } from "@portkey/provider-types";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Select from "react-select";

import "./home.scss";
import { Button } from "@/components/ui/button";
import { CATEGORY_OPTIONS, TODO_DATA } from "@/lib/constant";
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
import { DateIcons, PlusIcon } from "@/components/ui/icons";
import { calculateTimeRemaining } from "@/lib/utils";
import useTodoSmartContract from "@/hooks/useTodoSmartContract";

type todoObject = {
  name: string;
  description: string;
  date: string;
  tag: string;
};

type Option = {
  value: string;
  label: string;
};

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const HomePage = ({
  provider,
  currentWalletAddress,
}: {
  provider: IPortkeyProvider | null;
  currentWalletAddress?: string;
}) => {
  const [todoData, setTodoData] = useState<todoObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Option | null>();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const smartContract = useTodoSmartContract(provider);

  // get Todo Data from User's wallet using contract
  const getTodoData = async () => {
    try {
      const result = await smartContract?.callViewMethod("ListTasks", "");
      console.log("result", result);
      setTodoData(result?.data || []);
      setLoading(false);
    } catch (error) {
      console.log("error======", error);
    }
  };

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

  const createNewTask = async (values:{name:string,description:string}) => {
    try {
      await smartContract?.callSendMethod("Initialize", currentWalletAddress as string, {});
      alert("Initialize Successful")
      const sendData = {
        Name: values.name,
        Description: values.description,
        Category: selectedCategory?.value,
      };
      console.log("create task with this data",sendData)
      const result = await smartContract?.callSendMethod(
        "CreateTask",
        currentWalletAddress as string,
        sendData
      );
      console.log("result", result);
      setTodoData(TODO_DATA);
      setLoading(false);
    } catch (error) {
      console.log("error======", error);
    }
  };

  const onSubmit = async(values:{name:string,description:string}) => {
    await createNewTask(values);
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
        <div className="filter-wrapper">
          <span
            className={selectedFilter === "all" ? "active" : ""}
            onClick={() => setSelectedFilter("all")}
          >
            All
          </span>
          <span
            className={selectedFilter === "in-progress" ? "active" : ""}
            onClick={() => setSelectedFilter("in-progress")}
          >
            In Progress
          </span>
          <span
            className={selectedFilter === "completed" ? "active" : ""}
            onClick={() => setSelectedFilter("completed")}
          >
            Completed
          </span>
        </div>

        <Modal
          isVisible={isModalOpen}
          title={"Add New Todo Item"}
          onClose={() => setIsModalOpen(!isModalOpen)}
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
                      <FormMessage />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="select-container">
                <label>Select Types</label>
                <Select
                  //@ts-ignore
                  value={selectedCategory}
                  options={CATEGORY_OPTIONS}
                  //@ts-ignore
                  onChange={(opt: Option) => setSelectedCategory(opt)}
                  placeholder="Select Category"
                />
              </div>
              <div className="button-container">
                <Button type="submit" className="submit-btn">
                  Create New Item
                </Button>
              </div>
            </form>
          </Form>
        </Modal>

        {currentWalletAddress ? (
          <div className="todo-collection">
            {todoData.length > 0 ? (
              todoData.slice(0, 5).map((data: todoObject, index) => (
                <div className={"todo-card"} key={index}>
                  <div className="info">
                    <p className="title">{data.name}</p>
                    <p className="desc">{data.description}</p>
                    <div className="date">
                      <DateIcons />
                      <p>{calculateTimeRemaining(data.date)}</p>
                    </div>
                  </div>
                  <div className="right-container">
                    <div className="tags-wrapper">
                      <span>{data.tag}</span>
                    </div>
                    <div className="action-container">
                      <Button>Edit</Button>
                      <Button className="complete">Complete</Button>
                    </div>
                  </div>
                </div>
              ))
            ) : loading ? (
              <div className="bordered-container">
                <strong>Loading...</strong>
              </div>
            ) : (
              <div className="bordered-container">
                <strong>
                  It's Look like you don't have any NFT on your wallet
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
