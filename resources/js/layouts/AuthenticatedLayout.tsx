import React from 'react';

type AuthenticatedLayoutProps = {
  children: React.ReactNode;
  user?: any; 
  header?: React.ReactNode;
};

export default function AuthenticatedLayout({ children, user, header }: AuthenticatedLayoutProps) {
  return (
    <div>
      <header>{header}</header>
      <main>{children}</main>
    </div>
  );
}
