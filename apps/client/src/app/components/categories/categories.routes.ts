import { Routes } from "@angular/router";
import { AddCategoryComponent } from "./add-category/add-category.component";
import { CategoriesComponent } from "./categories.component";

export const CATEGORIES_ROUTES: Routes = [{
  path: '',
  component: CategoriesComponent,
  children: [
    {
      path: 'add',
      component: AddCategoryComponent
    },
    { path: '', component: CategoriesComponent, pathMatch: 'full' }
  ]
}];