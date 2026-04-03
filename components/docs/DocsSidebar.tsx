"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const NAV_GROUPS = [
  {
    label: "Getting Started",
    items: [
      { href: "/docs/getting-started", label: "Installation" },
    ],
  },
  {
    label: "Form Components",
    items: [
      { href: "/docs/form-field", label: "DynamicFormField" },
      { href: "/docs/form-builder", label: "FormBuilderStandard" },
      { href: "/docs/multistep-form", label: "MultiStepForm" },
    ],
  },
  {
    label: "Layout Primitives",
    items: [
      { href: "/docs/form-layout", label: "Form Layout" },
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

  return (
    <Sidebar>
      <SidebarContent>
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
                    <Link href={item.href} className={cn(
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
