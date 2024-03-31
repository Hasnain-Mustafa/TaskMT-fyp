import React, { useState,useEffect } from 'react';

import { Kanban,Calendar } from '../pages'
import getStatusColor from '../utils/utils';
const Tab = ({ label, value, selected, onSelect }) => (
  <div
    className={`cursor-pointer px-4 py-2 ${
      selected ? 'bg-gray-200 dark:bg-gray-800' : ''
    }`}
    onClick={() => onSelect(value)}
  >
    {label}
  </div>
);

const TabContent = ({ children, selectedValue, value }) =>
  selectedValue === value ? children : null;

const TabbedBar = ({ tabs, defaultTab }) => {
  const [selectedTab, setSelectedTab] = useState(defaultTab);

  return (
    <div >
      <div className="flex gap-4 ml-20 mt-10 ">
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
            selected={selectedTab === tab.value}
            onSelect={setSelectedTab}
          />
        ))}
      </div>
      {tabs.map((tab) => (
        <TabContent key={tab.value} selectedValue={selectedTab} value={tab.value}>
          {tab.content}
        </TabContent>
      ))}
    </div>
  );
};

const TabbedMenu = () => {
  const [tasks, setTasks] = useState([]);
  // Fetch tasks data and update the state
  useEffect(() => {
    fetch("http://localhost:8001/kanbanData")
      .then((res) => res.json())
      .then((resp) => {
    
        setTasks(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  const mapTasksToCalendarFormat = (tasks) => ({
    
 
  
    Id: tasks.id,
    Subject: tasks.Title,
    Description: tasks.Summary,
    StartTime: tasks.startDate.toLocaleString(),
    EndTime: tasks.dueDate.toLocaleString(),
    Member: tasks.assignee,
    Color: getStatusColor(tasks.Status)
  });
  // const calendarTasks = tasks.map(mapTasksToCalendarFormat);
  const calendarTasks = [...tasks.map(mapTasksToCalendarFormat)];
  console.log(calendarTasks)
  const tabs = [
    {
      label: 'Kanban',
      value: 'kanban',
      content: <Kanban />, // Render Kanban component
    },
    {
      label: 'Calendar',
      value: 'calendar',
      content: <Calendar calendarTasks={calendarTasks}/>, // Render Calendar component
    }
  ];

  return <TabbedBar tabs={tabs} defaultTab="kanban" />;
};

export default TabbedMenu;
