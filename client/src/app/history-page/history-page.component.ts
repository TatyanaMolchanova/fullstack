import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MaterialInstance, MaterialService } from "../shared/classes/material.service";
import { OrdersService } from "../shared/services/orders.service";
import { Subscription } from "rxjs";
import { Filter, Order } from "../shared/interfaces";

const STEP = 2

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tooltip') tooltipRef!: ElementRef
  tooltip!: MaterialInstance
  isFilterVisible: boolean = false
  offset = 0
  limit = STEP
  onSub!: Subscription
  orders: Order[] = []
  loading: boolean = false
  reloading: boolean = false
  noMoreOrders: boolean = false
  filter: Filter = {}

  constructor(private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.reloading = true
    this.fetch()
  }

  private fetch() {
    // const params = {
    //   offset: this.offset,
    //   limit: this.limit
    // }

    const params = Object.assign({}, this.filter, {
        offset: this.offset,
        limit: this.limit
    })

    //Фильтрация, реализуем так фильтры!
    this.onSub = this.ordersService.fetch(params).subscribe(orders => {
      // добавляем предыдущие элементы при клике на Загрузить еще к новым - пагинация на одной странице, доподзагрузка
      this.orders = this.orders.concat(orders)
      this.noMoreOrders = orders.length < STEP
      this.loading = false
      this.reloading = false
    })
  }


  loadMore() {
    this.offset += STEP
    this.loading = true
    this.fetch()
  }

  applyFilter(filter: Filter) {
    // debugger
    this.orders = []
    this.offset = 0
    this.filter = filter
    this.reloading = true
    this.fetch()
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0
  }

  ngAfterViewInit() {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef)
  }

  ngOnDestroy() {
    this.tooltip.destroy()
    this.onSub.unsubscribe()
  }
}
