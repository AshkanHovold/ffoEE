import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() type: 'success' | 'info' | 'warning' | 'danger' = 'info';
  @Input() message: string = '';

  icon: string = '';

  ngOnInit() {
    switch (this.type) {
      case 'success': this.icon = 'check_circle'; break;
      case 'info': this.icon = 'info'; break;
      case 'warning': this.icon = 'warning'; break;
      case 'danger': this.icon = 'error'; break;
    }
  }
}
