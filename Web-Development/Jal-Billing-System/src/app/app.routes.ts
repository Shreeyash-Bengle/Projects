import { Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StockComponent } from './stock/stock.component';
import { ReportComponent } from './report/report.component';
import { BillingComponent } from './billing/billing.component';
import { StaffComponent } from './staff/staff.component';
import { SettingComponent } from './setting/setting.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guard/auth.guard';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { SupplierComponent } from './supplier/supplier.component';
import { AllRecordsComponent } from './all-records/all-records.component';
import { DefStockComponent } from './def-stock/def-stock.component';
import { EInvoiceCreateComponent } from './e-invoice/e-invoice.component';
import { RoleGuardService } from './guard/role.guard';
import { UserComponent } from './user/user.component';
import { StockAlertComponent } from './stock-alert/stock-alert.component';
import { ConsigneeComponent } from './consignee/consignee.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: HeaderComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard', component: DashboardComponent,
        canActivate: [RoleGuardService],
        data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
      },
      {
        path: 'stock', component: StockComponent,
        canActivate: [RoleGuardService],
        data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
      },
      {
        path: 'report',
        component: ReportComponent,
        canActivate: [RoleGuardService],
        data: {
          roles: ['SUPER_ADMIN'],
        }
      },
      {
        path: 'billing', component: BillingComponent,
        canActivate: [RoleGuardService],
        data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
      },
      {
        path: 'billing/:id', component: BillingComponent,
        canActivate: [RoleGuardService],
        data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
      },
      {
        path: 'staff', component: StaffComponent,
        canActivate: [RoleGuardService],
        data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
      },
      {
        path: 'add-vendor', component: AddVendorComponent,
        canActivate: [RoleGuardService],
        data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
      },
      {
        path: 'supplier', component: SupplierComponent,
        canActivate: [RoleGuardService],
        data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
      },
      {
        path: 'consignee', component: ConsigneeComponent,
        canActivate: [RoleGuardService],
        data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
      },
      {
        path: 'stock-alert', component: StockAlertComponent,
        canActivate: [RoleGuardService],
        data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
      },
      {
        path: 'def-stock', component: DefStockComponent,
        canActivate: [RoleGuardService],
        data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
      },
      {
        path: 'all-invoices', component: AllRecordsComponent,
        canActivate: [RoleGuardService],
        data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
      },
      {
        path: 'e-invoice', component: EInvoiceCreateComponent,
        canActivate: [RoleGuardService],
        data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
      },
      {
        path: 'add-user',
        component: UserComponent,
        canActivate: [RoleGuardService],
        data: {
          roles: ['SUPER_ADMIN'],
        }
      },
    ],
  },

];
