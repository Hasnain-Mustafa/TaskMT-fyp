import { useState, useEffect } from "react";
import Backdrop from "./Backdrop";
import { MdCancel, MdAdd } from "react-icons/md";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { framerButtonVariants, framerdropIn } from "../components/framer";
import { getCurrentFormattedTime } from "../utils/utils";
import { pushNotifications } from "../features/auth/authActions";
import {
  createProject,
  updateProject,
} from "../features/projects/projectActions";
const projectSchema = z.object({
  title: z.string().min(1, "Project title is required."),
  summary: z.string().min(1, "Project summary is required."),
  weeks: z.number().min(0, "Project weeks must be at least 0.").nonnegative(),
  budget: z.number().min(0, "Project budget must be at least 0.").nonnegative(),
  assigneeEmails: z
    .array(z.string())
    .min(1, "At least one assignee email is required."),

  status: z.string(), // Assuming status is a string, add validation as needed
  creatorId: z.string(), // Ensure this is required or handled correctly
});

const CreateProjectsModal = ({
  handleCloseModal,
  initialData,
  // setNewProjectData,
  // newProjectData,
}) => {
  const [email, setEmail] = useState("");
  const [pid, setPid] = useState("");
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
    trigger,
    clearErrors,
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      status: "",
      summary: "",
      weeks: 0,
      budget: 0,
      assigneeEmails: [],
      creatorId: userInfo.id,
    },
  });
  // Set form default values when initialData changes
  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key, initialData[key]);
      });
      if (initialData.projectId) {
        setPid(initialData.projectId);
      }
    }
  }, [initialData, setValue]);
  const handleAddProject = async (data) => {
    console.log(data);
    const action = initialData ? updateProject : createProject;
    try {
      const result = initialData
        ? dispatch(action({ ...data, projectId: pid }))
        : dispatch(action(data));
      result.then((res) => {
        if (res && res.meta.requestStatus) {
          if (res.meta.requestStatus === "rejected") {
            toast.error(res.payload);
          } else if (res.meta.requestStatus === "fulfilled") {
            toast.success(
              `${initialData ? "Updated" : "Created"} Project Successfully`
            );
            reset();
            handleCloseModal();
            {
              !initialData &&
                res.payload.assigneeIds.forEach((assignee) => {
                  dispatch(
                    pushNotifications({
                      userId: assignee,
                      notification: [
                        {
                          image: "",
                          message: `You have been assigned to project ${res.payload.title}`,
                          desc: "Check the project details and start working on your tasks.",
                          time: getCurrentFormattedTime(),
                        },
                      ],
                    })
                  );
                });
            }
          }
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    clearErrors("assigneeEmails"); // Clear errors on change
  };

  const addEmailToList = () => {
    if (email) {
      const newEmails = [...watch("assigneeEmails"), email.trim()];
      setValue("assigneeEmails", newEmails);
      setEmail("");
      trigger("assigneeEmails"); // Trigger validation on update
    }
  };

  const removeEmailFromList = (indexToRemove) => {
    const newEmails = watch("assigneeEmails").filter(
      (_, index) => index !== indexToRemove
    );
    setValue("assigneeEmails", newEmails);
    trigger("assigneeEmails"); // Revalidate emails after removal
  };

  return (
    <Backdrop onClick={handleCloseModal}>
      <motion.form
        variants={framerdropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="rounded-lg border bg-card text-card-foreground shadow-sm w-96 mx-auto bg-white relative"
        onSubmit={handleSubmit(handleAddProject)}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        <motion.button
          whileTap={{
            scale: 0.75,
            transition: { duration: 0.1, ease: "linear" },
          }}
          type="button"
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={handleCloseModal}
        >
          <MdCancel size={24} />
        </motion.button>
        <div className="flex flex-col space-y-1 px-6 py-3 ">
          <h3 className="font-semibold tracking-tight text-2xl text-center">
            {initialData ? "Edit Project" : "Add Project"}
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium leading-none">
              Project Title
            </label>
            <input
              {...register("title")}
              className="flex h-10 min-w-full rounded-md border border-input bg-background outline outline-2 outline-gray-500 px-3 py-2 text-sm"
              placeholder="Enter Project Title"
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium leading-none">
              Project Summary
            </label>
            <input
              {...register("summary")}
              className="flex h-10 min-w-full rounded-md border border-input bg-background outline outline-2 outline-gray-500 px-3 py-2 text-sm"
              placeholder="Enter Project Summary"
            />
            {errors.summary && (
              <p className="text-red-500">{errors.summary.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium leading-none">
              Project Weeks
            </label>
            <input
              {...register("weeks", { valueAsNumber: true })}
              type="number"
              className="flex h-10 min-w-full rounded-md border border-input bg-background outline outline-2 outline-gray-500 px-3 py-2 text-sm"
              placeholder="Enter Project Duration in Weeks"
              min={0}
            />
            {errors.weeks && (
              <p className="text-red-500">{errors.weeks.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium leading-none">
              Project Budget
            </label>
            <input
              {...register("budget", { valueAsNumber: true })}
              type="number"
              className="flex h-10 min-w-full rounded-md border border-input bg-background outline outline-2 outline-gray-500 px-3 py-2 text-sm"
              placeholder="Enter Project Budget"
              min={0}
            />
            {errors.budget && (
              <p className="text-red-500">{errors.budget.message}</p>
            )}
          </div>
          {!initialData && (
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">
                Assignee Emails
              </label>
              <div className="relative">
                <input
                  name="assigneeEmails"
                  value={email}
                  onChange={handleEmailChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background outline outline-2 outline-gray-500 px-3 py-2 text-sm"
                  placeholder="Add Assignee Email"
                />
                <button
                  type="button"
                  onClick={addEmailToList}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  <MdAdd />
                </button>
              </div>
              {errors.assigneeEmails && (
                <p className="text-red-500">{errors.assigneeEmails.message}</p>
              )}
              <ul className="mt-2">
                {watch("assigneeEmails").map((email, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-1"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => removeEmailFromList(index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="items-center p-6 flex flex-col space-y-4">
          <div className="flex flex-col space-y-1">
            <motion.button
              variants={framerButtonVariants}
              whileTap="whileTap"
              whileHover="whileHover"
              className="rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-Hover h-10 px-4 py-2 w-full"
              type="submit"
            >
              {initialData ? "Edit Project" : "Add Project"}
            </motion.button>
          </div>
        </div>
      </motion.form>
    </Backdrop>
  );
};

export default CreateProjectsModal;
