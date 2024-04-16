import { TaskList, TaskBoard } from "../../components";

export const data = [
  {
    title: "Organize your tasks",
    desc: "Effortlessly manage your tasks with our intuitive task list feature.",
    Icon: TaskList,
    options: [
      "Create unlimited tasks",
      "Set deadlines and priorities",
      "Categorize tasks by projects or tags",
      "Assign tasks to team members",
    ],
  },
  {
    title: "Visualize your workflow",
    desc: "Gain insights into your project progress with our interactive task board.",
    Icon: TaskBoard,
    options: [
      "Drag and drop tasks across stages",
      "Track task status in real-time",
      "Collaborate with team members visually",
      "Customize board layout to fit your workflow",
    ],
  },
];
