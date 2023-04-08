import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {IconButtonComponent} from '~app/shared/components/icon-button/icon-button.component';
import {CardTagsComponent} from '~app/shared/components/card-tags/card-tags.component';
import {OpinionType} from '~app/typings/opinion/opinion.enums';
import {RouterLink} from '@angular/router';
import {OpinionStatsPanelComponent} from '~app/shared/components/opinion-stats-panel/opinion-stats-panel.component';
import {NgIf} from '@angular/common';
import {SwipeDirective} from '~app/shared/directives/swipe/swipe.directive';
import {BackgroundTextFillerDirective} from '~app/shared/directives/background-text-filler/background-text-filler.directive';

@Component({
  selector: 'app-opinion-card',
  templateUrl: './opinion-card.component.html',
  styleUrls: ['./opinion-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    IconButtonComponent,
    OpinionStatsPanelComponent,
    CardTagsComponent,
    SwipeDirective,
    BackgroundTextFillerDirective,
  ],
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
