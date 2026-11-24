import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
export default function AdminLayout() { return <div className="app-shell admin-shell"><Sidebar admin/><div className="app-body"><Topbar admin/><main className="app-main"><Outlet/></main></div></div>; }
