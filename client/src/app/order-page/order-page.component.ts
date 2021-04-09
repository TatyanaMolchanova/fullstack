import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { MaterialInstance, MaterialService } from "../shared/classes/material.service";
import { OrderService } from "./order.service";
import { OrderPosition } from "../shared/interfaces";

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

  constructor(private router: Router,
              public order: OrderService) { }

  ngOnInit(): void {
    this.isRoot = this.router.url === '/order'
    // отслеживаем смену роута не только во время инициализации страницы, а все время:
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
      console.log('Event', event)
        this.isRoot = this.router.url === '/order'
      }
    })
  }

  ngOnDestroy() {
    this.modal.destroy()
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
    this.modal.close()
  }
}
