import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button-page-container',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './back-button-page-container.component.html',
  styleUrl: './back-button-page-container.component.css',
})
export class BackButtonPageContainerComponent {
  @Input({ required: true }) backUrl!: string;
  constructor(private router: Router) {}

  protected onBack() {
    this.router.navigateByUrl(this.backUrl);
  }
}
