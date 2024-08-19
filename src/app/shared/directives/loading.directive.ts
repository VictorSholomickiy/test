import { tap } from 'rxjs/operators';
import { BehaviorSubject, MonoTypeOperatorFunction, Subscription } from 'rxjs';
import { Directive, effect, ElementRef, Host, inject, input, OnDestroy, OnInit, Renderer2, RendererFactory2 } from '@angular/core';

@Directive({
  selector: '[pending]',
  standalone: true,
})

export class LoadingDirective implements OnInit, OnDestroy {
  // DI
  private rendererFactory = inject(RendererFactory2);

  public pending = input<boolean>();

  private loading$ = new BehaviorSubject<boolean>(false);

  private subscription = new Subscription();
  private overlay: HTMLDivElement;

  private renderer: Renderer2;
  private elPosition: string;

  constructor(
    @Host() private elRef: ElementRef<HTMLElement>,
  ) {
    effect(() => this.loading$.next(<boolean>this.pending()));
  }

  public ngOnInit(): void {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.overlay = this.createOverlay(this.elRef.nativeElement);
    this.subscription = this.loading$.pipe(this.toggleOp(this.overlay)).subscribe();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public createOverlay(el: HTMLElement): HTMLDivElement {
    this.elPosition !== 'absolute' && this.renderer.setStyle(el, 'position', 'relative');

    const baseSpinner: HTMLDivElement = this.renderer.createElement('div');
    const baseSpinnerWrap: HTMLDivElement = this.renderer.createElement('div');

    this.renderer.addClass(baseSpinner, 'base-spinner');
    this.renderer.addClass(baseSpinnerWrap, 'base-spinner__wrapper');
    this.renderer.appendChild(baseSpinnerWrap, baseSpinner);
    this.renderer.appendChild(el, baseSpinnerWrap);
    this.renderer.setStyle(baseSpinnerWrap, 'display', 'none');

    return baseSpinnerWrap;
  }

  public toggleOp(overlay: HTMLDivElement): MonoTypeOperatorFunction<boolean> {
    return tap(loading =>
      loading
        ? this.renderer.setStyle(overlay, 'display', '')
        : this.renderer.setStyle(overlay, 'display', 'none'));
  }
}
