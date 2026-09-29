import React from "react";
import { Outlet } from "react-router-dom";
import SiteLayout from "../../user/layout/SiteLayout.jsx";

/**
 * Auth pages share the CulinaryHub chrome (header/footer) per Visily screens 6–8.
 * Form content is rendered via <Outlet /> inside the main area.
 */
export default function AuthLayout() {
  return (
    <SiteLayout>
      <div className="py-8 md:py-12">
        <Outlet />
      </div>
    </SiteLayout>
  );
}
