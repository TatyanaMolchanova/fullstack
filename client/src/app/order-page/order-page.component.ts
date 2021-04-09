import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { MaterialInstance, MaterialService } from "../shared/classes/material.service";
import { OrderService } from "./order.service";
import {Order, OrderPosition} from "../shared/interfaces";
import {OrdersService} from "../shared/services/orders.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modal') modalRef!: ElementRef
  isRoot!: boolean
  modal!: MaterialInstance
  pending: boolean = false
  onSub!: Subscription

  constructor(private router: Router,
              public order: OrderService,
              private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.isRoot = this.router.url === '/order'
    // отслеживаем смену роута не только во время инициализации страницы, а все время:
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
      // console.log('Event', event)
        this.isRoot = this.router.url === '/order'
      }
    })
  }

  ngOnDestroy() {
    this.modal.destroy()

    if (this.onSub) {
      this.onSub.unsubscribe()
    }
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  removePosition(orderPosition: OrderPosition) {
    this.order.remove(orderPosition)
  }

  open() {
    this.modal.open()
  }

  cancel() {
    this.modal.close()
  }

  submit() {
    // сейчас будем работать с сервером: this.pending = true
    this.pending = true

    this.modal.close()

    // const order: Order = this.order.list

    const order: Order = {
      // удаляем id из заказа для бэкенда и оставляем на UI
      list: this.order.list.map(item => {
        delete item._id
        return item
      })
    }

    this.onSub = this.ordersService.create(order).subscribe(
      newOrder => {
        MaterialService.toast(`Заказ №${newOrder.order} был добавлен.`)
        this.order.clear()
      },
      error => MaterialService.toast(error.error.message),
      () => {
        this.modal.close()
        //асинхронный код отработал
        this.pending = false
      }
    )
  }
}
