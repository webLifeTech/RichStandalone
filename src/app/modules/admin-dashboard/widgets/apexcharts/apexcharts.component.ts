import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, ViewChild } from "@angular/core";

import { ApexNonAxisChartSeries, ApexPlotOptions, ApexChart, ApexFill, ChartComponent, ApexStroke, NgApexchartsModule, ApexAxisChartSeries, ApexDataLabels, ApexXAxis, ApexYAxis, ApexTooltip, ApexLegend, ApexResponsive, ApexMarkers } from "ng-apexcharts";

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

export type SimplePieOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};

export type ColumnChartsOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-apexcharts',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule
  ],
  templateUrl: './apexcharts.component.html',
  styleUrl: './apexcharts.component.scss'
})
export class ApexchartsComponent implements OnInit {

  @Input() chartCount: number | any;
  @Input() chartSize: number | any;
  @Input() chartType: any = "";
  @Input() name: string | any;
  @Input() data: any = {};


  @ViewChild("chart") chart: ChartComponent | any;
  public chartOptions: Partial<ChartOptions> | any;
  public chartOptions1: Partial<ChartOptions1> | any;
  public chartOptions5: Partial<ChartOptions5> | any;
  public chartSimplePie: Partial<SimplePieOptions> | any;
  public chartColumnCharts: Partial<ColumnChartsOptions> | any;

  constructor() {

  }

  ngOnInit(): void {

    // Input properties are set here
    if (this.chartSize == 1) {
      this.chartOptions = {
        series: [this.data.percentage],
        chart: {
          height: 152,
          width: 152,
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
                  return this.data.chartLabel;
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
            gradientToColors: [this.data.chartColors[0]],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
            colorStops: [
              {
                offset: 0,
                color: this.data.chartColors[0],
                opacity: 1
              },
              {
                offset: 100,
                color: this.data.chartColors[1],
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
      this.chartOptions = {
        series: this.data.series,
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
      };
    }

    if (this.chartSize == 3) {
      this.chartOptions1 = {
        series: [
          {
            name: "",
            data: this.data.series
          }
        ],
        chart: {
          type: "bar",
          height: 330,
          toolbar: {
            show: false
          },
        },
        plotOptions: {
          bar: {
            barHeight: "100%",
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: "bottom"
            }
          }
        },
        colors: [
          "#33b2df",
          "#546E7A",
          "#d4526e",
          "#13d8aa",
          "#A5978B",
        ],
        dataLabels: {
          enabled: true,
          style: {
            colors: ["#fff"]
          },
          formatter: function (val: any, opt: any) {
            return "  " + val;
          },
        },
        stroke: {
          width: 1,
          colors: ["#fff"]
        },
        xaxis: {
          categories: this.data.chartLabels
        },
        yaxis: {
          labels: {
            show: false
          }
        },
        title: {
          text: "Custom DataLabels",
          align: "center",
          floating: true
        },
        subtitle: {
          text: "Category Names as DataLabels inside bars",
          align: "center"
        },
        tooltip: {
          theme: "dark",
          x: {
            show: false
          },
          y: {
            title: {
              formatter: function () {
                return "";
              }
            }
          }
        }
      };
    }

    if (this.chartSize == 4) {
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
            // width: "50%"
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: this.data.chartLabels,
          labels: {
            offsetX: 200,
            offsetY: 200,
            // minWidth: 400
          }
          // width: "50%"
        }
      };
    }

    if (this.chartSize == 5) {
      this.chartOptions5 = {
        series: this.data.series,
        chart: {
          height: 296,
          type: "radialBar"
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 360,
            hollow: {
              margin: 5,
              size: "40%",
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
        colors: ["#22c55e", "#ff5630", "#ffb00c"],
        labels: this.data.chartLabels,
        legend: {
          show: true,
          floating: false,
          fontSize: "16px",
          fontWeight: "bold",
          position: "bottom",
          offsetX: 0,
          offsetY: 10,
          labels: {
            useSeriesColors: true
          },
          formatter: function (seriesName: any, opts: any) {
            return seriesName;
          },
          itemMargin: {
            horizontal: 3
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

    if (this.chartType === 'simplepie') {
      console.log("this.data.series ----->", this.data.series);

      this.chartSimplePie = {
        series: this.data.series, // [1, 2, 3, 4, 5]
        chart: {
          width: 200,
          type: "pie",
          // offsetX: 10,
          toolbar: {
            show: false
          },
        },
        legend: {
          show: true,
          position: 'left',
          fontSize: "10px",
          fontWeight: 600,
          offsetY: -10,
          markers: {
            strokeWidth: 1
          },
          itemMargin: {
            horizontal: -10,
            vertical: 0,
          },
        },
        dataLabels: {
          enabled: false,
        },
        labels: this.data.chartLabels,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom",
              }
            }
          }
        ]
      };
    }

    if (this.chartType === 'column_charts') {
      this.chartColumnCharts = {
        series: this.data.series,
        chart: {
          type: "bar",
          background: '#fff',
          height: 350,
          width: '100%',
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: true,
          // textAnchor: "bottom",
          style: {
            colors: ["#fff"]
          },
          // formatter: function (val, opt) {
          //   return opt.w.globals.labels[opt.dataPointIndex];
          // },
          // offsetX: 0,
          // dropShadow: {
          //   enabled: true
          // }
        },
        // colors: ["#22c55e", "#ff5630", "#ffb00c"],
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: this.data.chartLabels
        },
        yaxis: {
          title: {
            // text: "$ (thousands)"
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val: any) {
              return val;
            }
          }
        }
      };
    }
  }
}
