import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HCMore from 'highcharts/highcharts-more';
import HighchartsExporting from 'highcharts/modules/exporting';
import noData from 'highcharts/modules/no-data-to-display';

// Initialise additional modules (not sure if needed yet)
HCMore(Highcharts);
HighchartsExporting(Highcharts);
noData(Highcharts);

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
