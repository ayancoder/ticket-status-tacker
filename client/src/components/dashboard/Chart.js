import React, { PureComponent } from 'react';
import { useTheme } from '@material-ui/core/styles';
import Title from './Title';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    date: '1 Jun 2021',
    created: 2,
    closed: 3,
  },
  {
    date: '2 Jun 2021',
    created: 4,
    closed: 1,
  },
  {
    date: '3 Jun 2021',
    created: 0,
    closed: 0,
  },
  {
    date: '4 Jun 2021',
    created: 0,
    closed: 1,
  },
  {
    date: '5 Jun 2021',
    created: 2,
    closed: 4,
  },
  {
    date: '6 Jun 2021',
    created: 3,
    closed: 6,
  },
  {
    date: '7 Jun 2021',
    created: 9,
    closed: 8,
  },
];

export default function Chart() {
  const theme = useTheme();

  return (
    
    <ResponsiveContainer width="100%" height="100%">
    <BarChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="1 1" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="created" fill="#8884d8" />
      <Bar dataKey="closed" fill="#82ca9d" />
    </BarChart>
  </ResponsiveContainer> 
  );
}