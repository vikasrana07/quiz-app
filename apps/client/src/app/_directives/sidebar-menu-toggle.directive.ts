import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[appSidebarMenuToggle]'
})
export class SidebarMenuToggleDirective {
    @HostBinding('class.active-menuitem') isClosed = false;

    constructor(private elRef: ElementRef) { }
    @HostListener('click', ['$event']) toggleOpen(event: Event) {
        this.isClosed = this.elRef.nativeElement.contains(event.target) ? !this.isClosed : false;
        if (this.isClosed) {
            this.elRef.nativeElement.children[1].style.height = "auto";
        } else {
            this.elRef.nativeElement.children[1].style.height = "0";
        }
    }
}