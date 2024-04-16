import React from 'react';
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  LineSeries,
  Category,
  Tooltip,
  Legend,
} from '@syncfusion/ej2-react-charts';

// Updated lineCustomSeries with specific 'fill' property for the "Sport" series
const lineCustomSeries = [
  {
    dataSource: [
      { x: 'Mon', y: 35 },
      { x: 'Tue', y: 40 },
      { x: 'Wed', y: 32 },
      { x: 'Thu', y: 42 },
      { x: 'Fri', y: 53 },
      { x: 'Sat', y: 45 },
      { x: 'Sun', y: 38 }
    ],
    xName: 'x',
    yName: 'y',
    name: 'Project 01',
    type: 'Line',
    fill: 'red', // Set the line color to red for "Sport"
    marker: { visible: true, width: 10, height: 10 }
  },
  {
    dataSource: [
      { x: 'Mon', y: 28 },
      { x: 'Tue', y: 35 },
      { x: 'Wed', y: 30 },
      { x: 'Thu', y: 33 },
      { x: 'Fri', y: 36 },
      { x: 'Sat', y: 32 },
      { x: 'Sun', y: 34 }
    ],
    xName: 'x',
    yName: 'y',
    name: 'Project 02',
    type: 'Line',
    marker: { visible: true, width: 10, height: 10 }
  }
];

const linePrimaryXAxis = { valueType: 'Category', interval: 1, majorGridLines: { width: 0 } };
const linePrimaryYAxis = {
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
  lineStyle: { width: 0 },
  labelFormat: '{value}%',
  rangePadding: 'None'
};

const ChartCard = () => {
  return (
    // Reduced max-width and padding for a smaller card size
    <div className="p-3 bg-white text-black shadow-lg rounded-3xl max-w-sm mx-auto">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-md font-semibold">Weekly progress</h2>
      </div>
      
      <div className="w-full">
        <ChartComponent
          id="line-chart"
          // Removed width property to allow it to fill the container
          primaryXAxis={linePrimaryXAxis}
          primaryYAxis={linePrimaryYAxis}
          chartArea={{ border: { width: 0 } }}
          tooltip={{ enable: true }}
          legendSettings={{ background: 'white', textStyle: { color: '#000' } }}
          background='white'
        >
          <Inject services={[LineSeries, Category, Tooltip, Legend]} />
          <SeriesCollectionDirective>
            {lineCustomSeries.map((item, index) => (
              <SeriesDirective key={index} {...item} />
            ))}
          </SeriesCollectionDirective>
        </ChartComponent>
      </div>
    </div>
  );
};

export default ChartCard;