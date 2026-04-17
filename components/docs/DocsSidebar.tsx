"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"

const NAV_GROUPS = [
  {
    label: "Getting Started",
    items: [
      { href: "/docs/introduction", label: "Introduction" },
      { href: "/docs/getting-started", label: "Installation" },
    ],
  },
  {
    label: "Form Components",
    items: [
      { href: "/docs/form-field", label: "FieldRenderer" },
      { href: "/docs/form-builder", label: "SchemaForm" },
      { href: "/docs/multistep-form", label: "StepForm" },
    ],
  },
  {
    label: "Layout Primitives",
    items: [
      { href: "/docs/form-layout", label: "Form Layout" },
    ],
  },
  {
    label: "Theme",
    items: [
      { href: "/docs/theme-builder", label: "Theme Builder" },
    ],
  },
  {
    label: "Data Table",
    items: [
      { href: "/docs/data-table", label: "DynamicDataTable" },
    ],
  },
  {
    label: "State Management",
    items: [
      { href: "/docs/redux", label: "Redux Setup" },
    ],
  },
]

export function DocsSidebar() {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  const handleLinkClick = () => {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <span className="text-sm font-semibold text-foreground">Docs</span>
      </SidebarHeader>
      <SidebarContent className="scrollbar-themed">
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href} onClick={handleLinkClick} className={cn(
                      "text-sm",
                      pathname === item.href
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                    )}>
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
