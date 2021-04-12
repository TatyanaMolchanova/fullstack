import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import { Subscription } from "rxjs";
import {Chart, ChartConfiguration,} from 'chart.js'


import { AnalyticsService } from "../shared/services/analytics.service";
import {AnalyticsPage, ChartConfig} from "../shared/interfaces";


@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef!: ElementRef
  @ViewChild('order') orderRef!: ElementRef

  aSub!: Subscription
  average!: number
  pending: boolean = true

  constructor(private service: AnalyticsService) { }

  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132)'
    }

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average

      gainConfig.labels = data.chart.map(item => item.label)
      gainConfig.data = data.chart.map(item => item.gain)

      console.log('gainConfig.labels', gainConfig.labels)
      console.log('gainConfig.data', gainConfig.data)

      const gainContext = this.gainRef.nativeElement.getContext('2d')
      gainContext.canvas.height = '300px'



      Chart.defaults.interaction.mode = 'nearest';
      console.log('0 Chart.defaults', Chart.defaults);

      new Chart(gainContext, createChartConfig(gainConfig))


      // let myChart = new Chart(gainContext, {
      //   type: 'line',
      //   // type: 'LineController',
      //   options: {
      //     responsive: true
      //   },
      //   data: {
      //     labels: gainConfig.labels,
      //     datasets: [
      //       {
      //         type: 'line',
      //         label: gainConfig.label,
      //         data: gainConfig.data,
      //         borderColor: gainConfig.color,
      //         // steppedLine: false,
      //         fill: false
      //       }
      //     ]
      //   }
      // })

      // console.log('myChart', myChart)

      console.log('1 Chart.defaults', Chart.defaults);

      this.pending = false
    })
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

}
//
// function createChartConfig({labels, data, label, color}: ChartConfig) {
//   return {
//     // type: 'line',
//     type: 'line',
//     options: {
//       responsive: true
//     },
//     data: {
//       labels,
//       datasets: [
//         {
//           label, data,
//           borderColor: color,
//           steppedLine: false,
//           fill: false
//         }
//       ]
//     }
//   }
// }


// function createChartConfig({type, labels, data, label, color}: ChartConfig): ChartConfiguration<'line'> {
function createChartConfig({type, labels, data, label, color}: ChartConfig): ChartConfiguration<"line"> {

  return {
    type: 'line',
    // type: '"line"',
    // type,

    // options: {
    //   responsive: true,
    // },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          // steppedLine: false,
          fill: false
        }
      ]
    },
    // type: 'bubble',
    // chart: {
    //   type: 'line'
    // }
    // type: undefined
  }
}








//
//
//
// import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core'
// import {AnalyticsService} from '../shared/services/analytics.service'
// import {AnalyticsPage, ChartConfig} from '../shared/interfaces'
// import {Chart} from 'chart.js'
// import {Subscription} from 'rxjs'
//
// @Component({
//   selector: 'app-analytics-page',
//   templateUrl: './analytics-page.component.html',
//   styleUrls: ['./analytics-page.component.scss']
// })
// export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
//
//   @ViewChild('gain') gainRef!: ElementRef
//   @ViewChild('order') orderRef!: ElementRef
//
//   aSub!: Subscription
//   average!: number
//   pending = true
//
//   constructor(private service: AnalyticsService) {
//   }
//
//   ngAfterViewInit() {
//     const gainConfig: any = {
//       label: 'Выручка',
//       color: 'rgb(255, 99, 132)'
//     }
//
//     const orderConfig: any = {
//       label: 'Заказы',
//       color: 'rgb(54, 162, 235)'
//     }
//
//     this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
//       this.average = data.average
//
//       gainConfig.labels = data.chart.map(item => item.label)
//       gainConfig.data = data.chart.map(item => item.gain)
//
//       orderConfig.labels = data.chart.map(item => item.label)
//       orderConfig.data = data.chart.map(item => item.order)
//
//       // **** Gain ****
//       // gainConfig.labels.push('08.05.2018')
//       // gainConfig.labels.push('09.05.2018')
//       // gainConfig.data.push(1500)
//       // gainConfig.data.push(700)
//       // **** /Gain ****
//
//       // **** Order ****
//       // orderConfig.labels.push('08.05.2018')
//       // orderConfig.labels.push('09.05.2018')
//       // orderConfig.data.push(8)
//       // orderConfig.data.push(2)
//       // **** /Order ****
//
//       const gainCtx = this.gainRef.nativeElement.getContext('2d')
//       const orderCtx = this.orderRef.nativeElement.getContext('2d')
//       gainCtx.canvas.height = '300px'
//       orderCtx.canvas.height = '300px'
//
//       new Chart(gainCtx, createChartConfig(gainConfig))
//       new Chart(orderCtx, createChartConfig(orderConfig))
//
//       this.pending = false
//     })
//   }
//
//   ngOnDestroy() {
//     if (this.aSub) {
//       this.aSub.unsubscribe()
//     }
//   }
//
// }
//
//
// function createChartConfig({labels, data, label, color}: ChartConfig) {
//   return {
//     type: 'line',
//     options: {
//       responsive: true
//     },
//     data: {
//       labels,
//       datasets: [
//         {
//           label, data,
//           borderColor: color,
//           steppedLine: false,
//           fill: false
//         }
//       ]
//     }
//   }
// }
