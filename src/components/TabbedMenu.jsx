import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Kanban, Calendar } from '../pages';
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
    <div>
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
  const { userInfo } = useSelector((state) => state.auth);
  const { tasks } = useSelector((state) => state.tasks);


    

  const mapTasksToCalendarFormat = (task) => ({
    Id: task.id,
    Subject: task.Title || '',
    Description: task.Summary || '',
    StartTime: task.startDate ? task.startDate.toLocaleString() : '',
    EndTime: task.dueDate ? task.dueDate.toLocaleString() : '',
    Member: userInfo?.name || '',
    Color: getStatusColor(task.Status) || '',
  });

  const calendarTasks = tasks.map(task => mapTasksToCalendarFormat(task));

  const tabs = [
    {
      label: 'Kanban',
      value: 'kanban',
      content: <Kanban />, // Render Kanban component
    },
    {
      label: 'Calendar',
      value: 'calendar',
      content: <Calendar calendarTasks={calendarTasks} />, // Render Calendar component
    },
  ];

  return <TabbedBar tabs={tabs} defaultTab="kanban" />;
};

export default TabbedMenu;
