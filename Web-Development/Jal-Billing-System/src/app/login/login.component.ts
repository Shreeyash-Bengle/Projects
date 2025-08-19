import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  apiLoginObj: any = {
    username: '',
    password: '',
  };
  showPassword: boolean = false;

  router = inject(Router);
  http = inject(HttpClient);
  toastr: ToastrService = inject(ToastrService);

  onLogin() {
    if (!this.apiLoginObj.username || !this.apiLoginObj.password) {
      this.toastr.warning('Please enter both username and password', 'Validation');
      return;
    }

    this.http.post<any>('https://jal.beatsacademy.in/api/user/login/', this.apiLoginObj)
      .subscribe({
        next: (res) => {
          if (res.status === 'success' && res.token) {
            // Store user data in localStorage
            localStorage.setItem('token', res.token);
            localStorage.setItem('userID', res.userID.toString());
            localStorage.setItem('userRole', res.role);

            // Handle different roles
            switch (res.role) {
              case 'SUPER_ADMIN':
                this.toastr.success('Welcome Super Admin', 'Success');
                this.router.navigate(['/dashboard']);
                break;
              case 'ADMIN':
                this.toastr.success('Welcome Admin', 'Success');
                this.router.navigate(['/dashboard']);
                break;
              default:
                this.toastr.error('Invalid role', 'Access Denied');
                this.router.navigate(['/login']);
                break;
            }
          } else {
            console.error('Invalid response:', res);
            this.toastr.error('Login failed: Invalid response from server', 'Error');
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.toastr.error(error.error?.message || 'Invalid credentials', 'Login Failed');
        },
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
