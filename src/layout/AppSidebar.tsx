"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useLocale } from "../context/LocaleContext";
import { useAuth } from "../context/AuthContext";
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
} from "../icons/index";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  nameKey: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { nameKey: string; path: string; pro?: boolean; new?: boolean }[];
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { t } = useLocale();
  const pathname = usePathname();
  const { user } = useAuth();

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  const getSmartHomeItems = (): NavItem[] => [
    {
      icon: <GridIcon />,
      nameKey: "nav.mainMenu",
      path: "/mainmenu",
    },
    {
      icon: <TableIcon />,
  nameKey: "nav.serviceInvoice",
  path: "/serviceinvoices",
    },
    {
      icon: <PieChartIcon />,
      nameKey: "nav.myVouchers",
      path: "/myvouchers",
    },
    {
      icon: <CalenderIcon />,
      nameKey: "nav.announcements",
      path: "/announcements",
    },
    {
      icon: <CalenderIcon />,
      nameKey: "nav.events",
      path: "/events",
    },
    {
      icon: <BoxCubeIcon />,
      nameKey: "nav.myProperties",
      path: "/buildings/myproperty",
    },
  ];

  const getNavItems = (): NavItem[] => [
    {
      icon: <GridIcon />,
      nameKey: "nav.dashboard",
      subItems: [
        { nameKey: "nav.ecommerce", path: "/dashboard", pro: false },
        { nameKey: "nav.report", path: "/report", pro: false }
      ],
    },
    {
      icon: <TableIcon />,
      nameKey: "nav.serviceFeeInvoice",
      subItems: [
        { nameKey: "nav.allInvoices", path: "/invoices", pro: false },
        { nameKey: "nav.invoiceReports", path: "/invoices/reports", pro: false },
      ],
    },
    {
      icon: <CalenderIcon />,
      nameKey: "nav.eventsAnnouncements",
      subItems: [
        { nameKey: "nav.allEvents", path: "/events", pro: false },
        { nameKey: "nav.announcements", path: "/allannouncements", pro: false },
      ],
    },
    {
      icon: <PieChartIcon />,
      nameKey: "nav.vouchersPromotions",
      subItems: [
        { nameKey: "nav.allVouchers", path: "/vouchers", pro: false },
        { nameKey: "nav.promotions", path: "/promotions", pro: false },
      ],
    },
    {
      icon: <GridIcon />,
      nameKey: "nav.facilities",
      subItems: [
        { nameKey: "nav.allFacilities", path: "/facilities", pro: false },
        { nameKey: "nav.bookingManagement", path: "/facilities/bookings", pro: false },
      ],
    },
  ];

  const getMasterDataItems = (): NavItem[] => [
    {
      icon: <GridIcon />,
      nameKey: "nav.locations",
      subItems: [
        { nameKey: "nav.country", path: "/locations/country", pro: false },
        { nameKey: "nav.province", path: "/locations/province", pro: false },
        { nameKey: "nav.district", path: "/locations/district", pro: false },
        { nameKey: "nav.ward", path: "/locations/ward", pro: false },
        { nameKey: "nav.hamlet", path: "/locations/hamlet", pro: false },
      ],
    },
    {
      icon: <BoxCubeIcon />,
      nameKey: "nav.building", 
      subItems: [
        { nameKey: "nav.buildingCategory", path: "/buildings/category", pro: false },
        { nameKey: "nav.property", path: "/buildings/property", pro: false },
        { nameKey: "nav.zoneAreaSection", path: "/buildings/zone-area-section", pro: false },
        { nameKey: "nav.buildingBlock", path: "/buildings/building-block", pro: false },
        { nameKey: "nav.floor", path: "/buildings/floor", pro: false },
        { nameKey: "nav.propertyUnit", path: "/buildings/property-unit", pro: false },
      ],
    },
    {
      icon: <ListIcon />,
      nameKey: "nav.assetMaintenance",
      subItems: [
        { nameKey: "nav.allAssets", path: "/assets", pro: false },
        { nameKey: "nav.maintenance", path: "/maintenance", pro: false },
        { nameKey: "nav.maintenanceSchedule", path: "/maintenance/schedule", pro: false },
      ],
    },
    {
      icon: <UserCircleIcon />,
      nameKey: "nav.userManagement",
      subItems: [
        { nameKey: "nav.allUsers", path: "/user-management/users", pro: false },
        { nameKey: "nav.userRoles", path: "/user-management/roles", pro: false },
        { nameKey: "nav.rolePermissions", path: "/user-management/permissions", pro: false },
      ],
    },
  ];

  const getSystemConfigItems = (): NavItem[] => [
    {
      icon: <PlugInIcon />,
      nameKey: "nav.settings",
      subItems: [
        { nameKey: "nav.generalSettings", path: "/settings/general", pro: false },
        { nameKey: "nav.systemConfig", path: "/settings/system", pro: false },
        { nameKey: "nav.notifications", path: "/settings/notifications", pro: false },
      ],
    },
  ];

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others" | "masterData" | "systemConfig" | "smartHome"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.nameKey}>
          {nav.subItems ? (
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

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others" | "masterData" | "systemConfig" | "smartHome";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    const menuTypes: { type: "main" | "masterData" | "systemConfig" | "smartHome"; getItems: () => NavItem[] }[] = [
      { type: "smartHome", getItems: getSmartHomeItems },
      { type: "main", getItems: getNavItems },
      { type: "masterData", getItems: getMasterDataItems },
      { type: "systemConfig", getItems: getSystemConfigItems }
    ];
    
    menuTypes.forEach(({ type, getItems }) => {
      const items = getItems();
      items.forEach((nav: NavItem, index: number) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type,
                index,
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
  }, [pathname, isActive]);

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

  const handleSubmenuToggle = (index: number, menuType: "main" | "others" | "masterData" | "systemConfig" | "smartHome") => {
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
            {/* MY SMART HOME - Visible to NON-ADMIN users only */}
            {!isAdmin && (
              <div>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    "MY SMART HOME"
                  ) : (
                    <HorizontaLDots />
                  )}
                </h2>
                {renderMenuItems(getSmartHomeItems(), "smartHome")}
              </div>
            )}

            {/* Admin-only sections */}
            {isAdmin && (
              <>
                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                      !isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "justify-start"
                    }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "QUICK ACCESS"
                    ) : (
                      <HorizontaLDots />
                    )}
                  </h2>
                  {renderMenuItems(getNavItems(), "main")}
                </div>

                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                      !isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "justify-start"
                    }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "MY SMART HOME"
                    ) : (
                      <HorizontaLDots />
                    )}
                  </h2>
                  {renderMenuItems(getSmartHomeItems(), "smartHome")}
                </div>

                <div className="">
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                      !isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "justify-start"
                    }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "MASTER DATA"
                    ) : (
                      <HorizontaLDots />
                    )}
                  </h2>
                  {renderMenuItems(getMasterDataItems(), "masterData")}
                </div>

                <div className="">
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                      !isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "justify-start"
                    }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "SYSTEM CONFIGURATION"
                    ) : (
                      <HorizontaLDots />
                    )}
                  </h2>
                  {renderMenuItems(getSystemConfigItems(), "systemConfig")}
                </div>
              </>
            )}
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;