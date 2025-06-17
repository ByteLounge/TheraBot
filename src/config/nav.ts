import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, MessageSquare, History, UserCircle2, MapPin, FileText, Bot } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip?: string;
}

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, tooltip: "Dashboard" },
  { href: "/chat", label: "AI Chat", icon: MessageSquare, tooltip: "AI Chat" },
  { href: "/history", label: "Chat History", icon: History, tooltip: "Chat History" },
  { href: "/profile", label: "Profile", icon: UserCircle2, tooltip: "User Profile" },
  { href: "/therapists", label: "Find Therapists", icon: MapPin, tooltip: "Find Therapists" },
  { href: "/report", label: "Generate Report", icon: FileText, tooltip: "Generate Report" },
];

export const siteConfig = {
  name: "TheraBot",
  icon: Bot,
  description: "Your AI companion for mental wellness.",
};
