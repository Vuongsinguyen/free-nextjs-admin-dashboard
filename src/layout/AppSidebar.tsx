"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useLocale } from "../context/LocaleContext";
import { useMenu } from "../hooks/useMenu";
import { MenuItem } from "../types/menu";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
  DollarLineIcon,
  ShootingStarIcon,
} from "../icons/index";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  nameKey: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { nameKey: string; path: string; pro?: boolean; new?: boolean }[];
};

// Icon mapping function
const getIconComponent = (iconName?: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    'UserCircleIcon': <UserCircleIcon />,
    'TableIcon': <TableIcon />,
    'CalenderIcon': <CalenderIcon />,
    'ShootingStarIcon': <ShootingStarIcon />,
    'GridIcon': <GridIcon />,
    'PieChartIcon': <PieChartIcon />,
    'DollarLineIcon': <DollarLineIcon />,
    'BoxCubeIcon': <BoxCubeIcon />,
    'ListIcon': <ListIcon />,
    'PlugInIcon': <PlugInIcon />,
  };
  return iconName ? (iconMap[iconName] || <GridIcon />) : <GridIcon />;
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { t } = useLocale();
  const pathname = usePathname();
  const { menuGroups, loading: menuLoading } = useMenu();

  // Filter out specific menu entries (e.g., "Role Permissions") from sidebar
  const filteredMenuGroups = useMemo(() => {
    // Helper to deep-filter menu items
    const shouldRemove = (item: MenuItem) =>
      item.name_key === 'rolePermissions' || (item.path?.includes('/user-management/permissions'));

    const filterItems = (items: MenuItem[]): MenuItem[] => {
      return items
        .map((item) => {
          // Recursively filter children first
          const subItems = item.subItems ? filterItems(item.subItems) : [];

          // If this item should be removed, drop it entirely
          if (shouldRemove(item)) return null;

          // Keep item only if it has a valid path or has remaining subitems
          if ((item.path && item.path.length > 0) || subItems.length > 0) {
            return { ...item, subItems } as MenuItem;
          }

          // Otherwise, drop empty containers
          return null;
        })
        .filter((x): x is MenuItem => x !== null);
    };

    return menuGroups
      .map((group) => ({ ...group, items: filterItems(group.items) }))
      .filter((group) => group.items.length > 0);
  }, [menuGroups]);

  // Convert MenuItem to NavItem format
  const convertMenuItemToNavItem = (item: MenuItem): NavItem => {
    return {
      nameKey: item.name_key,
      icon: getIconComponent(item.icon),
      path: item.path,
      subItems: item.subItems?.map(subItem => ({
        nameKey: subItem.name_key,
        path: subItem.path || '',
        pro: subItem.is_pro,
        new: subItem.is_new
      }))
    };
  };

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others" | "masterData" | "systemConfig"
  ) => {
    console.log('🎨 Rendering menu items:', menuType, navItems.map(n => ({ 
      name: n.nameKey, 
      hasSubItems: !!n.subItems,
      subItemsCount: n.subItems?.length || 0 
    })));
    
    return (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.nameKey}>
          {nav.subItems && nav.subItems.length > 0 ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{t(nav.nameKey)}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{t(nav.nameKey)}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.nameKey}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {t(subItem.nameKey)}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
    );
  };

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others" | "masterData" | "systemConfig";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    if (menuLoading || menuGroups.length === 0) return;

    // Check if the current path matches any submenu item
    let submenuMatched = false;
    
    menuGroups.forEach((group) => {
      group.items.forEach((item: MenuItem, itemIdx: number) => {
        if (item.subItems && item.subItems.length > 0) {
          item.subItems.forEach((subItem) => {
            if (subItem.path && isActive(subItem.path)) {
              const menuType = group.group;
              setOpenSubmenu({
                type: menuType,
                index: itemIdx,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive, menuGroups, menuLoading]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others" | "masterData" | "systemConfig") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`pt-[19px] pb-6 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={220}
                height={60}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={220}
                height={60}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {/* Render dynamic menu from database */}
            {filteredMenuGroups.map((group) => (
              <div key={group.group}>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    group.titleKey
                  ) : (
                    <HorizontaLDots />
                  )}
                </h2>
                {renderMenuItems(
                  group.items.map(convertMenuItemToNavItem),
                  group.group
                )}
              </div>
            ))}
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;