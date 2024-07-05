import { FormControl } from '@angular/forms';

export interface RegisterForm {
  name: FormControl;
  surname: FormControl;
  userType: FormControl;
  email: FormControl;
  password: FormControl;
}
