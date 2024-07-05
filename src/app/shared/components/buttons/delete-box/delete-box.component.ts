import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-box',
  templateUrl: './delete-box.component.html',
  styleUrl: './delete-box.component.css',
})
export class DeleteBoxComponent {
  @Input() entityName: string | undefined;
  @Output() delete = new EventEmitter<void>(); // Evento emitido al confirmar la eliminación

  confirmDelete() {
    if (confirm(`¿Estás seguro que deseas eliminar este ${this.entityName}?`)) {
      this.delete.emit();
    }
  }
}
