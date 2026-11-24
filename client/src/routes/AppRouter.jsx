import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import LandingPage from '../pages/public/LandingPage';
import PrivacyPolicyPage from '../pages/public/PrivacyPolicyPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import DashboardPage from '../pages/user/DashboardPage';
import BookmarksPage from '../pages/user/BookmarksPage';
import AddBookmarkPage from '../pages/user/AddBookmarkPage';
import BookmarkDetailPage from '../pages/user/BookmarkDetailPage';
import EditBookmarkPage from '../pages/user/EditBookmarkPage';
import CategoriesPage from '../pages/user/CategoriesPage';
import SearchPage from '../pages/user/SearchPage';
import RemindersPage from '../pages/user/RemindersPage';
import ProfilePage from '../pages/user/ProfilePage';
import SettingsPage from '../pages/user/SettingsPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminUserDetailPage from '../pages/admin/AdminUserDetailPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import UnauthorizedPage from '../pages/errors/UnauthorizedPage';
import NotFoundPage from '../pages/errors/NotFoundPage';
export default function AppRouter() { return <BrowserRouter><Routes>
  <Route element={<PublicLayout/>}>
    <Route path="/" element={<LandingPage/>}/>
    <Route path="/privacy" element={<PrivacyPolicyPage/>}/>
  </Route>
  <Route element={<AuthLayout/>}><Route path="/login" element={<LoginPage/>}/><Route path="/signup" element={<SignupPage/>}/><Route path="/forgot-password" element={<ForgotPasswordPage/>}/></Route>
  <Route element={<ProtectedRoute/>}>
    <Route path="/app" element={<UserLayout/>}>
      <Route index element={<Navigate to="dashboard" replace/>}/><Route path="dashboard" element={<DashboardPage/>}/>
      <Route path="bookmarks" element={<BookmarksPage/>}/><Route path="bookmarks/new" element={<AddBookmarkPage/>}/>
      <Route path="bookmarks/:id" element={<BookmarkDetailPage/>}/><Route path="bookmarks/:id/edit" element={<EditBookmarkPage/>}/>
      <Route path="categories" element={<CategoriesPage/>}/><Route path="search" element={<SearchPage/>}/>
      <Route path="reminders" element={<RemindersPage/>}/><Route path="profile" element={<ProfilePage/>}/><Route path="settings" element={<SettingsPage/>}/>
    </Route>
    <Route element={<AdminRoute/>}><Route path="/admin" element={<AdminLayout/>}>
      <Route index element={<AdminDashboardPage/>}/><Route path="users" element={<AdminUsersPage/>}/><Route path="users/:id" element={<AdminUserDetailPage/>}/><Route path="settings" element={<AdminSettingsPage/>}/>
    </Route></Route>
  </Route>
  <Route path="/unauthorized" element={<UnauthorizedPage/>}/><Route path="*" element={<NotFoundPage/>}/>
</Routes></BrowserRouter>; }
