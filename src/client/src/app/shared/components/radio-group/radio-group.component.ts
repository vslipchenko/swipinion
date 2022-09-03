import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {RadioGroupItem} from '~app/typings/button/button.interfaces';
import {RadioGroupPosition} from '~app/typings/button/button.types';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupComponent {
  @Input() public color: ThemePalette;
  @Input() public items: Array<RadioGroupItem> = [];
  @Input() public position: RadioGroupPosition = 'vertical';
  @Input() public control = new FormControl();
}
