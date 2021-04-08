import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CategoriesService } from "../../shared/services/categories.service";
import { switchMap } from 'rxjs/operators';
import { of } from "rxjs";
import {MaterialService} from "../../shared/classes/material.service";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

  form!: FormGroup
  isNew: boolean = true

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
            this.form.patchValue({
              name: category.name
            })
            MaterialService.updateTextInput()
          }
          this.form.enable()
        },
      error => MaterialService.toast(error.error.message)
    )
  }

  onSubmit() {

  }
}
