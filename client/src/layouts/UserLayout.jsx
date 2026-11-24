import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import FloatingAI from '../components/ai/FloatingAI';
export default function UserLayout() { return <div className="app-shell"><Sidebar/><div className="app-body"><Topbar/><main className="app-main"><Outlet/></main></div><FloatingAI/></div>; }
