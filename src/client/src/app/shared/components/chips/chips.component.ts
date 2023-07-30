import {ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef} from '@angular/core';
import {
  MatLegacyChipInputEvent as MatChipInputEvent,
  MatLegacyChipsModule as MatChipsModule,
} from '@angular/material/legacy-chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {
  MatLegacyFormFieldAppearance as MatFormFieldAppearance,
  MatLegacyFormFieldModule as MatFormFieldModule,
} from '@angular/material/legacy-form-field';
import {FormControl} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatChipsModule, MatFormFieldModule, MatIconModule, NgIf, NgTemplateOutlet, NgForOf],
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

  protected addOnBlur = true;
  protected chips: Array<string> = [];
  protected readonly separatorKeysCodes = [ENTER, COMMA];

  public ngOnInit(): void {
    this.control.setValue(this.chips); // Reference value
  }

  protected add(event: MatChipInputEvent): void {
    const validValue = this.regexp ? this.regexp.test(event.value) : true;

    if (validValue) this.chips.push(event.value);

    event.chipInput.clear();
  }

  protected remove(index: number): void {
    this.chips.splice(index, 1);
  }
}
