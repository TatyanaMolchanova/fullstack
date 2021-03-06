import { Injectable } from "@angular/core";
import { OrderPosition, Position } from "../shared/interfaces";

@Injectable()
export class OrderService {

  public list: OrderPosition[] = []
  public price = 0

  add(position: Position) {
    const orderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id
    })

    // убираем дубликаты позиций в заказе
    const candidate = this.list.find(p => p._id === orderPosition._id)

    if (candidate) {
      // изменяем количество
      candidate.quantity! += orderPosition.quantity!
    } else {
      this.list.push(orderPosition)
    }

    this.computePrice()
  }

  remove(orderPosition: OrderPosition) {
    const index = this.list.findIndex(p => p._id === orderPosition._id)
    this.list.splice(index, 1)
    this.computePrice()
  }

  clear() {
    this.list = []
    this.price = 0
  }

  private computePrice() {
    this.price = this.list.reduce((total, item) => {
      return total += item.quantity! * item.cost
    }, 0)
  }
}
