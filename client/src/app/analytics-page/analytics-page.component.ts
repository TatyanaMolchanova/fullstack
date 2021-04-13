import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import { Chart, ChartConfiguration, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js'


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

    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235)'
    }

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average

      gainConfig.labels = data.chart.map(item => item.label)
      gainConfig.data = data.chart.map(item => item.gain)

      orderConfig.labels = data.chart.map(item => item.label)
      orderConfig.data = data.chart.map(item => item.order)

      // **** Gain **** it has to be commented
      // gainConfig.labels.push('08.05.2018')
      // gainConfig.labels.push('09.05.2018')
      // gainConfig.data.push(1500)
      // gainConfig.data.push(700)
      // **** /Gain ****

      // **** Order **** it has to be commented
      // orderConfig.labels.push('08.05.2018')
      // orderConfig.labels.push('09.05.2018')
      // orderConfig.data.push(8)
      // orderConfig.data.push(2)
      // **** /Order ****

      const gainCtx = this.gainRef.nativeElement.getContext('2d')
      const orderCtx = this.orderRef.nativeElement.getContext('2d')
      gainCtx.canvas.height = '300px'
      orderCtx.canvas.height = '300px'

      Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

      new Chart(gainCtx, createChartConfig(gainConfig))
      new Chart(orderCtx, createChartConfig(orderConfig))

      this.pending = false
    })
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

}

function createChartConfig({type, labels, data, label, color}: ChartConfig): ChartConfiguration<"line">{
  return {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          stepped: false,
          fill: false
        }
      ]
    }
  }
}
