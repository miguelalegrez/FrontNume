import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginForm } from '../../models/login.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  protected loginForm: FormGroup<LoginForm>;
  protected errorMessage: string;
  // Hay que poner barrabaja porque es una propiedad privada.
  constructor(private _authService: AuthService) {
    this.loginForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });

    this.errorMessage = '';
  }

  // Capturamos el evento submit del formulario y recogemos los valores
  protected async onLogin(event: SubmitEvent) {
    event.preventDefault();
    this.errorMessage = '';
    const email = this.loginForm.get('email')!.value;
    const password = this.loginForm.get('password')!.value;

    try {
      const user = await this._authService.login(email, password);
    } catch (error: unknown) {
      this.errorMessage = 'Error logging in ';
    }
  }
}
