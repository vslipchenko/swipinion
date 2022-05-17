import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatFormFieldAppearance} from '@angular/material/form-field';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipsComponent {
  @Input() public label = '';
  @Input() public extendClass = '';
  // @Input() public color: ThemePalette;
  @Input() public appearance: MatFormFieldAppearance = 'standard';

  public addOnBlur = true;
  public chips: Array<string> = [];
  public readonly separatorKeysCodes = [ENTER, COMMA];

  public add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) this.chips.push(value);

    event.chipInput!.clear();
  }

  public remove(): void {}

  // remove(fruit: Fruit): void {
  //   const index = this.fruits.indexOf(fruit);
  //
  //   if (index >= 0) {
  //     this.fruits.splice(index, 1);
  //   }
  // }
}
