import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CategoriesService } from "../../shared/services/categories.service";
import { switchMap } from 'rxjs/operators';
import { of } from "rxjs";
import { MaterialService } from "../../shared/classes/material.service";
import { Category } from "../../shared/interfaces";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input') inputRef!: ElementRef
  form!: FormGroup
  image!: File
  imagePreview!: string | ArrayBuffer | null | undefined
  isNew: boolean = true
  category!: Category

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })

    this.form.disable()

    //commented is old method
    // this.route.params.subscribe((params: Params) => {
    //   if (params['id']) {
    //     // We edit form
    //     this.isNew = false
    //   }
    // })

    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isNew = false
              return this.categoriesService.getById(params['id'])
            }

            return of(null)
          }
        )
      ).subscribe(
        category => {
          if (category) {
            this.category = category
            this.form.patchValue({
              name: category.name
            })
            this.imagePreview = category.imageSrc
            MaterialService.updateTextInput()
            console.log('1 this.form', this.form)
          }
          this.form.enable()
          console.log('2 this.form', this.form)
        },
      error => MaterialService.toast(error.error.message)
    )
  }

  triggerClick() {
    this.inputRef.nativeElement.click()
  }

  onFileUpload(event: any) {
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()

    reader.onload = () => {
      this.imagePreview = reader.result
    }

    reader.readAsDataURL(file)
  }

  formSubmit() {
    // console.log('onSUBMIT')
    let obs$
    this.form.disable()
    // console.log('this.isNew', this.isNew)
    if (this.isNew) {
      //create
      obs$ = this.categoriesService.create(this.form.value.name, this.image)
    } else {
      //update
      obs$ = this.categoriesService.update(this.category._id!, this.form.value.name, this.image)
    }

    obs$.subscribe(
      category => {
        this.category = category
        MaterialService.toast('Изменения сохранены')
        this.form.enable()
      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }
}
