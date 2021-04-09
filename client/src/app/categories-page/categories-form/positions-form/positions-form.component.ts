import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { PositionsService } from "../../../shared/services/positions.service";
import { Position } from "../../../shared/interfaces";
import { MaterialInstance, MaterialService } from "../../../shared/classes/material.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId!: string
  @ViewChild('modal') modalRef!: ElementRef
  positions: Position[] = []
  loading: boolean = false
  modal!: MaterialInstance
  form!: FormGroup
  positionId: string | undefined = ''

  constructor(private positionsService: PositionsService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)])
    })

    this.loading = true
    // debugger
    this.positionsService.fetch(this.categoryId).subscribe(positions => {
      this.positions = positions
      this.loading = false
    })
  }

  ngOnDestroy() {
    this.modal!.destroy()
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  onSelectPosition(position: Position) {
    //при редактировании позиции заносив в флаг positionId значение
    this.positionId = position._id
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    this.modal.open()
    MaterialService.updateTextInput()
  }

  onAddPosition() {
    //при добавлении позиции удаляем из флага positionId значение
    this.positionId = ''
    this.form.reset({name: null, cost: 1})
    this.modal.open()
    MaterialService.updateTextInput()
  }

  onCancel() {
    this.modal.close()
  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation()
    const decision = window.confirm(`Удалить позицию "${position.name}"?`)

    if (decision) {
      this.positionsService.delete(position).subscribe(
        // надо найти позицию, которую мы удалили в базе данных и удалить ее из списка UI
        response => {
          const index = this.positions.findIndex(p => p._id === position._id)
          this.positions.splice(index, 1)
          MaterialService.toast(response.message)
        },
        error => MaterialService.toast(error.error.message)
      )
    }
  }

  onSubmit() {
    this.form.disable()

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }

    const completed = () => {
      this.modal.close()
      this.form.reset({name: '', cost: 1})
      this.form.enable()
    }

    // Если есть позиция, то редактируем ее, если позиции нет, то будем ее создавать - это добавление и редактирование
    if (this.positionId) {
      //если позиция есть, редактируем ее, для этого сначала новой позиции присваиваем id
      newPosition._id = this.positionId
      console.log('newPosition._id', newPosition._id)
      this.positionsService.update(newPosition).subscribe(
        position => {
          //чтобы обновить измененные данные позиции на UI, находим индекс измененной позиции и затем обновляем
          // текущий список позиций измененным на сервере значением позиции this.positions[index] = position
          const index = this.positions.findIndex(p => p._id === position._id)
          this.positions[index] = position
          MaterialService.toast('Изменения сохранены')
        },
        error => MaterialService.toast(error.error.message),
        completed
      )
    } else {
      //создаем позицию
      this.positionsService.create(newPosition).subscribe(
        position => {
          MaterialService.toast('Позиция создана')
          this.positions.push(position)
        },
        error => MaterialService.toast(error.error.message),
        completed
      )
    }




    // // Если есть позиция, то редактируем ее, если позиции нет, то будем ее создавать - это добавление и редактирование
    // if (this.positionId) {
    //   //если позиция есть, редактируем ее, для этого сначала новой позиции присваиваем id
    //   newPosition._id = this.positionId
    //   console.log('newPosition._id', newPosition._id)
    //   this.positionsService.update(newPosition).subscribe(
    //     position => {
    //       MaterialService.toast('Изменения сохранены')
    //     },
    //     error => MaterialService.toast(error.error.message),
    //     () => {
    //       this.modal.close()
    //       this.form.reset({name: '', cost: 1})
    //       this.form.enable()
    //     }
    //   )
    // } else {
    //   //создаем позицию
    //   this.positionsService.create(newPosition).subscribe(
    //     position => {
    //       MaterialService.toast('Позиция создана')
    //       this.positions.push(position)
    //     },
    //     error => MaterialService.toast(error.error.message),
    //     () => {
    //       this.modal.close()
    //       this.form.reset({name: '', cost: 1})
    //       this.form.enable()
    //     }
    //   )
    // }



  }
}
