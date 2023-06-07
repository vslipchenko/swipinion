import {Directive, ElementRef, Injector, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {AuthClickConfiguration, AuthClickMethod} from '~app/typings/auth-click/auth-click.types';
import {authClickGuard} from '~app/utilities/guard';

@Directive({
  selector: '[appAuthClick]',
  standalone: true,
})
export class AuthClickDirective implements OnInit, OnDestroy {
  @Input() public appAuthClick!: AuthClickMethod | AuthClickConfiguration;

  public constructor(private readonly injector: Injector) {}

  public ngOnInit(): void {
    // Access the host element using the elementRef
    const hostElement = this.injector.get(ElementRef).nativeElement;

    // Add the click event listener to the host element
    this.removeClickListener = this.injector
      .get(Renderer2)
      .listen(hostElement, 'click', authClickGuard(this.appAuthClick, this.injector));
  }

  public ngOnDestroy(): void {
    this.removeClickListener();
  }

  public removeClickListener = (): void => {};
}
