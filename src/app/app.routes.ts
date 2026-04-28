import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { AboutPage } from './components/about/about';
import { Gallery } from './components/gallery/gallery';
import { Achievements } from './components/achievements/achievements';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { StaffDashboard } from './components/staff-dashboard/staff-dashboard';
import { StudentDashboard } from './components/student-dashboard/student-dashboard';
import { Attendance } from './components/attendance/attendance';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'achievements', component: Achievements },
  { path: 'about/about-us', component: AboutPage },
  { path: 'about/head1', component: AboutPage },
  { path: 'about/head2', component: AboutPage },
  { path: 'gallery', component: Gallery },
  // AUTH ROUTE
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  //  DASHBOARDS
  { path: 'admin', component: AdminDashboard },
  { path: 'staff', component: StaffDashboard },
  { path: 'student', component: StudentDashboard },

  { path: 'attendance', component: Attendance },

  //  OPTIONAL (fallback)
  { path: '**', redirectTo: '' }

  
];