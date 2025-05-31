import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  GitBranch,
  Play,
  Calendar,
  Database,
  Plug,
  Cog,
  Users,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const navigation = [
  {
    title: "Main",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Pipeline Builder", href: "/pipeline-builder", icon: GitBranch },
      { name: "Job Monitor", href: "/job-monitor", icon: Play },
      { name: "Scheduler", href: "/scheduler", icon: Calendar },
    ]
  },
  {
    title: "Data",
    items: [
      { name: "Connectors", href: "/connectors", icon: Plug },
      { name: "Data Sources", href: "/data-sources", icon: Database },
    ]
  },
  {
    title: "Settings",
    items: [
      { name: "Configuration", href: "/configuration", icon: Cog },
      { name: "Access Control", href: "/access-control", icon: Users },
    ]
  }
];

export default function Sidebar() {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={cn(
      "sidebar-transition bg-white border-r border-carbon-gray-20 h-screen fixed lg:relative lg:translate-x-0 -translate-x-full z-40",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-end p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 px-4 space-y-6">
          {navigation.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-carbon-gray-50 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <li key={item.name}>
                      <Link href={item.href}>
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          className={cn(
                            "w-full justify-start",
                            isActive && "bg-carbon-blue text-white",
                            isCollapsed && "px-2"
                          )}
                        >
                          <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                          {!isCollapsed && <span>{item.name}</span>}
                        </Button>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
