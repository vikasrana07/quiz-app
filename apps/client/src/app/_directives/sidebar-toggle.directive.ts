import { Directive, HostBinding, HostListener, Renderer2 } from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[appSidebarToggle]'
})
export class SidebarToggleDirective {
    @HostBinding('class.layout-static-inactive') isClosed = true;
    constructor(
        private renderer: Renderer2
    ) { }
    @HostListener('click', ['$event']) toggleOpen() {
        this.isClosed = !this.isClosed;
        const elm = document.querySelector(".layout-container");
        if (this.isClosed) {
            this.renderer.addClass(elm, "layout-static-inactive");
        } else {
            this.renderer.removeClass(elm, "layout-static-inactive");
        }
    }
}