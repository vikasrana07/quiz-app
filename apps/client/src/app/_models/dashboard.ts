/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  GridsterConfig,
  GridsterItem,
  GridsterItemComponentInterface,
} from 'angular-gridster2';
export enum DisplayGrid {
  Always = 'always',
  OnDragAndResize = 'onDrag&Resize',
  None = 'none',
}

export enum CompactType {
  None = 'none',
  CompactUp = 'compactUp',
  CompactLeft = 'compactLeft',
  CompactUpAndLeft = 'compactUp&Left',
  CompactLeftAndUp = 'compactLeft&Up',
  CompactRight = 'compactRight',
  CompactUpAndRight = 'compactUp&Right',
  CompactRightAndUp = 'compactRight&Up',
}

export enum GridType {
  Fit = 'fit',
  ScrollVertical = 'scrollVertical',
  ScrollHorizontal = 'scrollHorizontal',
  Fixed = 'fixed',
  VerticalFixed = 'verticalFixed',
  HorizontalFixed = 'horizontalFixed',
}

// tslint:disable-next-line:no-empty-interface
export interface DashboardConfig extends GridsterConfig {}

export interface Dashboard extends GridsterItem {
  id?: number;
  name?: string;
  description?: string;
  isPrimary?: number;
  isLocked?: number;
  type?: any;
  widgets?: Array<DashboardWidget>;
}
// tslint:disable-next-line:no-empty-interface
export interface DashboardItemComponentInterface
  extends GridsterItemComponentInterface {}

// tslint:disable-next-line:no-empty-interface
export interface DashboardWidget extends Dashboard {}
