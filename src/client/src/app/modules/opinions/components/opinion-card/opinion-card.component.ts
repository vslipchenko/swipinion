import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {OpinionType} from '~app/typings/opinion/opinion.enums';

@Component({
  selector: 'app-opinion-card',
  templateUrl: './opinion-card.component.html',
  styleUrls: ['./opinion-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpinionCardComponent implements OnInit {
  @Input() public id = '';
  @Input() public username = '';
  @Input() public type = OpinionType.Text;
  @Input() public fileUrl = '';
  @Input() public body = '';
  @Input() public agreed = '';
  @Input() public disagreed = '';
  @Input() public comments = '';
  @Input() public agreedWith = false;
  @Input() public disagreedWith = false;
  @Input() public commented = false;
  @Input() public tags: Array<string> = [];

  protected textContent = false;
  protected textBackground = false;
  protected backgroundUrl = '';

  public ngOnInit(): void {
    if (this.body || this.tags.length) this.textContent = true;

    if (this.fileUrl) {
      this.backgroundUrl = `url('${this.fileUrl}')`;
    } else if (this.body) {
      // assume OpinionType = Text
      this.textBackground = true;
    }
  }
}
