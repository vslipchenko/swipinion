import {ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef} from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatFormFieldAppearance} from '@angular/material/form-field';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipsComponent implements OnInit {
  @Input() public label = '';
  @Input() public control = new FormControl();
  @Input() public extendClass = '';
  @Input() public placeholder = '';
  @Input() public regexp?: RegExp;
  // @Input() public color: ThemePalette;
  @Input() public appearance: MatFormFieldAppearance = 'standard';
  @Input() public hint?: TemplateRef<unknown>;

  public addOnBlur = true;
  public chips: Array<string> = [];
  public readonly separatorKeysCodes = [ENTER, COMMA];

  public ngOnInit(): void {
    this.control.setValue(this.chips); // Reference value
  }

  public add(event: MatChipInputEvent): void {
    const validValue = this.regexp ? this.regexp.test(event.value) : true;

    if (validValue) this.chips.push(event.value);

    event.chipInput!.clear();
  }

  public remove(index: number): void {
    this.chips.splice(index, 1);
  }
}
