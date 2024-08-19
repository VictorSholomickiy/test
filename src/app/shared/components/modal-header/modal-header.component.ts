import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { Component, ViewEncapsulation, input, output } from '@angular/core';

@Component({
  selector: 'modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['modal-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
  ],
})
export class ModalHeaderComponent {
  public title = input<string>();

  public closeModal = output<void>();
  public clickBtnCollapse = output<void>();
}
