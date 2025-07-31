import ModernFooter from "./footer";
import ModernHeader from "./Header";

import React from "react";

const Layout = ({ children }) => {
  return (
    <>
      <ModernHeader />
      {children}
      <ModernFooter />
    </>
  );
};

export default Layout;
