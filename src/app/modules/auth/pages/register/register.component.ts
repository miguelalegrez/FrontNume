import { Component } from '@angular/core';
import { RegisterForm } from '../../models/register.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  protected registerForm: FormGroup<RegisterForm>;

  constructor() {
    this.registerForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      surname: new FormControl(null, Validators.required),
      userType: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  // Capturamos el evento submit del formulario y recogemos los valores
  onRegister(event: SubmitEvent) {
    event?.preventDefault;
    const name = this.registerForm.get('name')!.value;
    const surname = this.registerForm.get('surname')!.value;
    const email = this.registerForm.get('email')!.value;
    const password = this.registerForm.get('password')!.value;
  }
}
