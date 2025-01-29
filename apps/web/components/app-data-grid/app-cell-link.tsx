import Link from 'next/link';
import { ReactNode } from 'react';

interface HoverableCellLinkProps {
  children: ReactNode;
  href: string;
}

const HoverableCellLink = ({
  children,
  href,
}: HoverableCellLinkProps): ReactNode => {
  return (
    <Link
      href={href}
      className="transition-all duration-200 ease-in-out hover:scale-105 hover:font-medium hover:underline"
    >
      <span className="sr-only">View details for</span>
      {children}
    </Link>
  );
};

export default HoverableCellLink;
