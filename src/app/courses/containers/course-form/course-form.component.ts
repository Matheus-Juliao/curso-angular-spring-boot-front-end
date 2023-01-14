import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { CoursesService } from '../../services/courses.service';
import { Course } from '../../model/course';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {

  public form = this.formBuilder.group({
    _id: [''],
    name: ['', [ Validators.required, Validators.minLength(3), Validators.maxLength(100) ]],
    category: ['', [ Validators.required ]]
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private service: CoursesService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    const course: Course = this.route.snapshot.data['course'];
    this.form.setValue({
      _id: course._id,
      name: course.name,
      category: course.category
    })
  }

  public onSubmit() {
    this.service.save(this.form.value)
      .subscribe({
        next: result => this.onSuccess(),
        error: error => this.onError()
      })
  }

  public onCancel() {
    this.location.back()
  }

  private onSuccess() {
    this.snackBar.open('Curso salvo com sucesso.', '', { duration: 5000 })
    this.onCancel()
  }

  private onError() {
    this.snackBar.open('Erro ao salvar curso.', '', { duration: 5000 })
  }

  public getErrorMessage(fieldName: string) {
    const field = this.form.get(fieldName)

    if(field?.hasError('required')) {
      return 'Campo obrigatório';
    }

    if(field?.hasError('minlength')) {
      const requiredLength = field.errors ? field.errors['minlength']['requiredLength'] : 3

      return `Tamanho mínimo precisa ser de ${requiredLength} caracteres`
    }

    if(field?.hasError('maxlength')) {
      const requiredLength = field.errors ? field.errors['maxlength']['requiredLength'] : 100

      return `Tamanho máximo precisa ser de ${requiredLength} caracteres`;
    }

    return 'Campo inválido'
  }

}
