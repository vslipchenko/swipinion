import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-flat-button',
  templateUrl: './flat-button.component.html',
  styleUrls: ['./flat-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatButtonComponent implements OnInit {
  @Input() public text = '';
  @Input() public extendClass = '';
  @Input() public color: ThemePalette;

  @Output() public clicked = new EventEmitter<void>();


  constructor() { }

  ngOnInit(): void {
  }

}
