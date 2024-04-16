import React from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, DateTime, SplineAreaSeries, Legend, Tooltip } from '@syncfusion/ej2-react-charts';

import { ChartsHeader } from '../../components';
// import { areaCustomSeries, areaPrimaryXAxis, areaPrimaryYAxis } from '../../data/dummy';
import { useStateContext } from '../../contexts/ContextProvider';
// Sample data for three members' daily task completion
const memberTaskData = [
  { memberName: 'John', dailyTasks: [{ date: '2024-04-10', tasks: 2}, { date: '2024-04-11', tasks: 3 }, { date: '2024-04-12', tasks: 6 },  { date: '2024-04-13', tasks: 6 }] },
  { memberName: 'Jane', dailyTasks: [{ date: '2024-04-10', tasks: 3 }, { date: '2024-04-11', tasks: 7 }, { date: '2024-04-12', tasks: 2 }] },
  { memberName: 'Doe', dailyTasks: [{ date: '2024-04-10', tasks: 1 }, { date: '2024-04-11', tasks: 5 }, { date: '2024-04-12', tasks: 2}] },
];

// Assuming your transformDataToSeries function is already defined, modify it like so:
const transformDataToSeries = (data) => {
  const colors = ['black', 'gray', 'white']; // Define your color array
  return data.map((member, index) => ({
    dataSource: member.dailyTasks.map((task) => ({
      x: new Date(task.date),
      y: task.tasks,
    })),
    xName: 'x',
    yName: 'y',
    name: member.memberName,
    opacity: '0.8',
    type: 'SplineArea',
    width: '2',
    fill: colors[index % colors.length], // Assign a color to each series
  }));
};

const areaCustomSeries = transformDataToSeries(memberTaskData);

// Define the primary X and Y axes
export const areaPrimaryXAxis = {
  valueType: 'DateTime',
  labelFormat: 'dd/MMM',
  intervalType: 'Days',
  edgeLabelPlacement: 'Shift',
  labelStyle: { color: 'gray' },
};
export const areaPrimaryYAxis = {
  labelFormat: '{value}',
  title: 'Completed Tasks', // Title for the Y-axis
  lineStyle: { width: 0 },
  maximum: Math.max(...memberTaskData.map(member => Math.max(...member.dailyTasks.map(task => task.tasks)))) + 1,
  interval: 1,
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
  labelStyle: { color: 'gray' },
};

const Area = () => {
  const { currentMode } = useStateContext();
const tooltipRender = (args) => {
    // Ensures that the Y value is included in the tooltip content
    // Check that args.point and args.series are defined and have the correct properties
    if (args.point && args.series && args.point.y !== undefined && args.series.name) {
      args.text = `${args.series.name} - Date: ${args.point.x.toLocaleDateString()}, Tasks: ${args.point.y}`;
    } else {
      // Fallback text in case something is undefined
      args.text = "Data not available";
    }
  };
  // Custom style to make the chart smaller
  const chartStyle = {
    height: '300px', // Adjust height as needed
    width: '100%', // Adjust width as needed, or set a specific width
    maxWidth: '500px', // Set a maximum width for the chart container
  };

  return (
    <div className="m-2 md:m-5 mt-12 p-5 bg-white dark:bg-secondary-dark-bg rounded-2xl" style={chartStyle}>
     <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">Tracking progress</h2>
      </div>
      
      <div style={chartStyle}>
        <ChartComponent
          id="charts"
          primaryXAxis={areaPrimaryXAxis}
          primaryYAxis={areaPrimaryYAxis}
          chartArea={{ border: { width: 0 } }}
          background={currentMode === 'Dark' ? '#33373E' : '#fff'}
          legendSettings={{ background: 'white' }}
          tooltip={{ enable: true, shared: true}}
          tooltipRender={tooltipRender}
          // Apply the custom style here as well
          style={chartStyle}
        >
          <Inject services={[SplineAreaSeries, DateTime, Legend, Tooltip]} />
          <SeriesCollectionDirective>
            {areaCustomSeries.map((item, index) => (
              <SeriesDirective key={index} {...item} />
            ))}
          </SeriesCollectionDirective>
        </ChartComponent>
      </div>
    </div>
  );
};

export default Area;
