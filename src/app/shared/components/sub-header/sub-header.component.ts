import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-sub-header',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    CommonModule,
    RouterLink,
    SharedModule,
  ],
  templateUrl: './sub-header.component.html',
  styleUrl: './sub-header.component.css',
})
export class SubHeaderComponent {
  constructor(private router: Router) {}

  navigateToCreateUser() {
    this.router.navigate(['/create-user']);
  }

  navigateToCreateAppointment() {
    this.router.navigate(['appointments/create-appointment']);
  }
}
