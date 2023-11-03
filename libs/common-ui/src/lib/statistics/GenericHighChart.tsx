import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HCMore from 'highcharts/highcharts-more';
import HighchartsExporting from 'highcharts/modules/exporting';

// Initialise additional modules (not sure if needed yet)
HCMore(Highcharts);
HighchartsExporting(Highcharts);

export type GenericHighChartProps = {
  options: Highcharts.Options;
};

export const GenericHighChart = ({ options }: GenericHighChartProps) => {
  return (
    <div className="w-full">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
