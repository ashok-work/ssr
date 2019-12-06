import { Component, OnInit, HostListener } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AddCategoryDialogComponent } from './dialogs/add-category-dialog.component';
import { AddPackageDialogComponent } from './dialogs/add-package-dialog.component';
import { DeleteCategoryDialogComponent } from './dialogs/delete-category-dialog.component';
import { DeleteItemDialogComponent } from './dialogs/delete-item-dialog.component';
import { AddItemDialogComponent } from './dialogs/add-item-dialog.component';
import { AddPackageItemDialogComponent } from './dialogs/add-package-item-dialog.component';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss']
})
export class AddMenuComponent implements OnInit {

  space_id: any;
  space_name: any;
  categories: any = [];
  catering_packages: any = [];
  selected_category: any;
  items: any = [];
  allow_multiple_catering_packages = true;

  constructor(
    public commonServices: CommonService,
    public route: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((param) => {
      if (param['space_id'] && param['space_name']) {
        this.space_id = param['space_id'];
        // this.space_name = param['space_name'].replace(/-/g, ' ');
        this.space_name = decodeURIComponent(param['space_name']);
        this.resizeElements();
        this.getPackageInfo();
        this.getData();
      }
      else {
        this.router.navigate(['/my-spaces']);
      }
    });
  }

  getPackageInfo() {
    const request = {
      action_url: '/spaces/space-catering-info/' + this.space_id,
      method: 'GET',
      params: {}
    }

    this.commonServices.doHttp(request).subscribe(
      (data: any) => {
        this.allow_multiple_catering_packages = data.allow_multiple_catering_packages;
      },
      err => {
        this.commonServices.errorHandler(err);
      }
    )
  }

  async getData() {
    await this.getCategories()
    await this.getCateringPackages();

    if (this.catering_packages.length) {
      this.selected_category = this.catering_packages[0];
      this.getCategoryItems(this.selected_category.category_id);
    } else if (this.categories.length) {
      this.selected_category = this.categories[0];
      this.getCategoryItems(this.selected_category.category_id);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    if (window.innerWidth > 1015) {
      this.resizeElements();
    }
    else {
      this.resizeElements();
    }
  }

  resizeElements() {
    document.getElementById('custom-container').style.height = window.innerHeight - 57 + 'px';
    document.getElementById('left-box').style.height = window.innerHeight - 57 + 'px';
    document.getElementById('right-box').style.height = window.innerHeight - 57 + 'px';
  }

  async getCategories() {
    const request = {
      action_url: '/catering/categories/' + this.space_id,
      method: 'GET',
      params: {}
    }

    this.commonServices.presentLoading();
    try {
      let response = await this.commonServices.doHttp(request).toPromise();
      this.categories = response;
    }
    catch (err) {
      console.log(err);
    }
    finally {
      this.commonServices.dismissLoading();
    }
    // this.commonServices.doHttp(request).subscribe(
    //   data => {
    //     this.commonServices.dismissLoading();
    //     this.categories = data;
    //     this.selected_category = this.categories[0];
    //     this.getCategoryItems(this.selected_category.category_id);
    //   },
    //   err => {
    //     this.commonServices.dismissLoading();
    //     this.commonServices.errorHandler(err);
    //   }
    // );
  }

  async getCateringPackages() {
    const request = {
      action_url: '/catering/categories/' + this.space_id,
      method: 'GET',
      params: {
        is_catering_package: true
      }
    }

    this.commonServices.presentLoading();
    this.commonServices.presentLoading();
    try {
      let response = await this.commonServices.doHttp(request).toPromise();
      this.catering_packages = response;
    }
    catch (err) {
      console.log(err);
    }
    finally {
      this.commonServices.dismissLoading();
    }
    // this.commonServices.doHttp(request).subscribe(
    //   (data: any) => {
    //     this.commonServices.dismissLoading();
    //     this.catering_packages = data;
    //     this.selected_category = this.catering_packages[0];
    //     this.getCategoryItems(this.selected_category.category_id);
    //   },
    //   err => {
    //     this.commonServices.dismissLoading();
    //     this.commonServices.errorHandler(err);
    //   }
    // );
  }

  getCategoryItems(category_id) {
    const request = {
      action_url: '/catering/items/' + category_id,
      method: 'GET',
      params: {}
    }

    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe(
      (data: any) => {
        this.commonServices.dismissLoading();
        this.items = data;
        console.log(this.items);
      },
      err => {
        this.commonServices.dismissLoading();
        this.commonServices.errorHandler(err);
      }
    );
  }

  togglePackageInfo(event) {
    const request = {
      action_url: '/spaces/',
      method: 'PUT',
      params: {
        space_id: this.space_id,
        allow_multiple_catering_packages: event.target.checked,
      }
    }

    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe(
      data => {
        this.commonServices.dismissLoading();
        this.allow_multiple_catering_packages = event.target.checked;
      },
      err => {
        this.commonServices.dismissLoading();
        this.commonServices.errorHandler(err);
      }
    );
  }

  showChoices(item_id) {
    let elem = document.getElementById(item_id);
    let view = document.getElementById('view' + item_id);
    let hide = document.getElementById('hide' + item_id);
    elem.classList.add('d-block');
    elem.classList.remove('d-none');
    view.classList.remove('d-inline');
    view.classList.add('d-none');
    hide.classList.add('d-inline');
    hide.classList.remove('d-none');
  }

  hideChoices(item_id) {
    let elem = document.getElementById(item_id);
    let view = document.getElementById('view' + item_id);
    let hide = document.getElementById('hide' + item_id);
    elem.classList.remove('d-block');
    elem.classList.add('d-none');
    view.classList.add('d-inline');
    view.classList.remove('d-none');
    hide.classList.remove('d-inline');
    hide.classList.add('d-none');
  }

  openAddCategoryDialog() {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      width: '400px',
      panelClass: 'add-category-dialog',
      backdropClass: 'custom-dialog',
      data: {
        space_id: this.space_id,
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.getCategories();
    })
  }

  openEditCategoryDialog() {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      width: '400px',
      panelClass: 'add-category-dialog',
      backdropClass: 'custom-dialog',
      autoFocus: false,
      data: {
        space_id: this.space_id,
        selected_category: this.selected_category,
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      // if (result) this.getCategories();
    })
  }

  openAddPackageDialog() {
    const dialogRef = this.dialog.open(AddPackageDialogComponent, {
      width: '600px',
      panelClass: 'add-package-dialog',
      backdropClass: 'custom-dialog',
      data: {
        space_id: this.space_id,
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.getCateringPackages();
    })
  }

  openEditPackageDialog() {
    const dialogRef = this.dialog.open(AddPackageDialogComponent, {
      width: '600px',
      panelClass: 'add-package-dialog',
      backdropClass: 'custom-dialog',
      autoFocus: false,
      data: {
        space_id: this.space_id,
        selected_category: this.selected_category,
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      // if (result) this.getCateringPackages();
    })
  }

  openDeleteConfirmationDialog() {
    const dialogRef = this.dialog.open(DeleteCategoryDialogComponent, {
      width: '400px',
      panelClass: 'delete-category-dialog',
      backdropClass: 'custom-dialog',
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.deleteCategory();
    })
  }

  openDeleteItemDialog(item_id) {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      width: '400px',
      panelClass: 'delete-item-dialog',
      backdropClass: 'custom-dialog',
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.deleteItem(item_id);
    })
  }

  openAddItemDialog() {
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      width: '600px',
      panelClass: 'add-item-dialog',
      backdropClass: 'custom-dialog',
      data: {
        category_id: this.selected_category.category_id,
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.getCategoryItems(this.selected_category.category_id);
    })
  }

  openEditItemDialog(item) {
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      width: '600px',
      panelClass: 'edit-item-dialog',
      backdropClass: 'custom-dialog',
      autoFocus: false,
      data: {
        category_id: this.selected_category.category_id,
        item: item,
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      // if (result) this.getCategoryItems(this.selected_category.category_id);
    })
  }

  openAddPackageItemDialog() {
    const dialogRef = this.dialog.open(AddPackageItemDialogComponent, {
      width: '400px',
      panelClass: 'add-item-dialog',
      backdropClass: 'custom-dialog',
      data: {
        category_id: this.selected_category.category_id,
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.getCategoryItems(this.selected_category.category_id);
    })
  }

  openEditPackageItemDialog(item) {
    const dialogRef = this.dialog.open(AddPackageItemDialogComponent, {
      width: '400px',
      panelClass: 'add-item-dialog',
      backdropClass: 'custom-dialog',
      autoFocus: false,
      data: {
        category_id: this.selected_category.category_id,
        item: item,
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      // if (result) this.getCategoryItems(this.selected_category.category_id);
    })
  }

  selectCategory(index) {
    this.selected_category = this.categories[index];
    this.getCategoryItems(this.selected_category.category_id);
  }

  selectPackage(index) {
    this.selected_category = this.catering_packages[index];
    this.getCategoryItems(this.selected_category.category_id);
  }

  deleteCategory() {
    const request = {
      action_url: '/catering/category/' + this.selected_category.category_id,
      method: 'DELETE',
      params: {}
    }

    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe(
      data => {
        this.commonServices.dismissLoading();
        if (this.selected_category.is_catering_package) this.getCateringPackages();
        else this.getCategories();
        this.commonServices.notification(data['msg']);
      },
      err => {
        this.commonServices.dismissLoading();
        this.commonServices.errorHandler(err);
      }
    )
  }

  deleteItem(item_id) {
    const request = {
      action_url: '/catering/item/' + item_id,
      method: 'DELETE',
      params: {}
    }

    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe(
      data => {
        this.commonServices.dismissLoading();
        this.getCategoryItems(this.selected_category.category_id);
        this.commonServices.notification(data['msg']);
      },
      err => {
        this.commonServices.dismissLoading();
        this.commonServices.errorHandler(err);
      }
    )
  }
}
