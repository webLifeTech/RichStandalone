import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, ViewChild } from "@angular/core";

import { ApexNonAxisChartSeries, ApexPlotOptions, ApexChart, ApexFill, ChartComponent, ApexStroke, NgApexchartsModule, ApexAxisChartSeries, ApexDataLabels, ApexXAxis, ApexYAxis, ApexTooltip, ApexLegend, ApexResponsive } from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
};

export type ChartOptions1 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  colors: string[];
};

export type ChartOptions5 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive | ApexResponsive[];
};

@Component({
  selector: 'app-user-apexcharts',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule
  ],
  templateUrl: './user-apexcharts.component.html',
  styleUrl: './user-apexcharts.component.scss'
})
export class UserApexchartsComponent implements OnInit {

  @Input() chartCount: number | any;
  @Input() chartSize: number | any;
  @Input() chartHeight: number | any;
  @Input() name: string | any;
  @Input() data: any = {};


  @ViewChild("chart") chart: ChartComponent | any;
  public chartOptions: Partial<ChartOptions> | any;
  public chartOptions1: Partial<ChartOptions1> | any;
  public chartOptions5: Partial<ChartOptions5> | any;


  constructor() {

  }

  ngOnInit(): void {


    if (this.chartSize == 1) {
      this.chartOptions = {
        series: [this.data.series],
        chart: {
          height: this.chartHeight || 170,
          width: this.chartHeight || 170,
          // width: 260,
          type: "radialBar",
          toolbar: {
            show: false
          },
          lables: false
        },
        plotOptions: {
          radialBar: {
            startAngle: 0,
            endAngle: 355,
            hollow: {
              margin: 0,
              size: "60%",
              background: "#fff",
              image: undefined,
              position: "front",
              dropShadow: {
                enabled: false,
                top: 3,
                left: 0,
                blur: 4,
                opacity: 0.24
              }
            },
            track: {
              background: "#edeff1",
              strokeWidth: "90%",
              margin: 0, // margin is in pixels
              dropShadow: {
                enabled: false,
                top: -3,
                left: 0,
                blur: 4,
                opacity: 0.35
              }
            },

            dataLabels: {
              show: true,
              name: {
                //   offsetY: -10,
                show: false,
                //   color: "#888",
                //   fontSize: "17px"
              },
              value: {
                formatter: (val: any) => {
                  return parseInt(val.toString(), 10).toString() + '%';
                },
                // marginTop: '10px',
                offsetY: 8,
                color: "#111",
                fontSize: "16px",
                fontWeight: "bold",
                show: true
              }
            }
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "horizontal",
            shadeIntensity: 0.5,
            gradientToColors: [this.data?.chartColors[0]],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
            colorStops: [
              {
                offset: 0,
                color: this.data?.chartColors[0],
                opacity: 1
              },
              {
                offset: 100,
                color: this.data?.chartColors[1],
                opacity: 1
              }
            ]
          }
        },
        stroke: {
          lineCap: "round"
        },
      };
    }

    if (this.chartSize == 2) {

      // this.chartOptions = {
      this.chartOptions = {
        series: this.data.series,
        // series: [38, 9, 6, 14, 33],
        chart: {
          type: "donut",
          height: 250,
        },
        dataLabels: {
          enabled: true,
          style: {
            colors: ['#F44336', '#F44336', '#F44336', '#E91E63', '#9C27B0']
          }
        },
        labels: this.data.chartLabels,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
                height: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      };;
    }

    if (this.chartSize == 3) {

      this.chartOptions1 = {

        colors: [
          "#33b2df",
          "#546E7A",
          "#d4526e",
          "#A5978B",
          "#13d8aa",
        ],
        fill: {
          opacity: 1
        },
        series: [
          {
            name: "",
            data: this.data.series,
          }
        ],
        chart: {
          type: "bar",
          height: 260,
          toolbar: {
            show: false
          },
        },

        plotOptions: {
          bar: {
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: this.data.chartLabels
        }
      };
    }

    if (this.chartSize == 4) {
      this.chartOptions = {
        series: [this.data],
        chart: {
          height: 160,
          width: 160,
          type: "radialBar",
          toolbar: {
            show: true
          },
          lables: false
        },
        plotOptions: {
          radialBar: {
            startAngle: 0,
            endAngle: 355,
            hollow: {
              margin: 0,
              size: "60%",
              background: "#fff",
              image: undefined,
              position: "front",
              dropShadow: {
                enabled: false,
                top: 3,
                left: 0,
                blur: 4,
                opacity: 0.24
              }
            },
            track: {
              background: "#edeff1",
              strokeWidth: "90%",
              margin: 0, // margin is in pixels
              dropShadow: {
                enabled: false,
                top: -3,
                left: 0,
                blur: 4,
                opacity: 0.35
              }
            },

            dataLabels: {
              show: true,
              name: {
                //   offsetY: -10,
                show: false,
                //   color: "#888",
                //   fontSize: "17px"
              },
              value: {
                formatter: (val: any) => {
                  return parseInt(val.toString(), 10).toString();
                },
                offsetY: 8,
                color: "#111",
                fontSize: "16px",
                fontWeight: "bold",
                show: true
              }
            }
          }
        },

        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "horizontal",
            shadeIntensity: 0.5,
            gradientToColors: ["#10b277"],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 75],
            colorStops: [
              {
                offset: 0,
                color: '#10b277',
                opacity: 1
              },
              {
                offset: 100,
                color: '#59e39a',
                opacity: 1
              }
            ]
          }
        },
        stroke: {
          lineCap: "round"
        },
        // labels: ['Paras']
      };
    }

    if (this.chartSize == 5) {

      this.chartOptions5 = {
        series: this.data.series,
        chart: {
          height: 270,
          type: "radialBar"
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 360,
            hollow: {
              margin: 5,
              size: "10%",
              background: "transparent",
              image: undefined
            },
            dataLabels: {
              name: {
                show: true
              },
              value: {
                show: false
              }
            }
          }
        },
        colors: [
          "#22c55e",
          "#ff5630",
          "#ff0000",
          "#ffb00c",
          "#00b8d9",
          "#ffb00c",
        ],
        labels: this.data.chartLabels,
        legend: {
          show: true,
          floating: false,
          fontSize: "10px",
          fontWeight: "bold",
          position: "bottom",
          offsetX: 0,
          offsetY: -10,
          labels: {
            useSeriesColors: true
          },
          formatter: function (seriesName: any, opts: any) {
            return seriesName;
          },
          itemMargin: {
            horizontal: 4
          }
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                show: false
              }
            }
          }
        ]
      };
    }
  }

}
