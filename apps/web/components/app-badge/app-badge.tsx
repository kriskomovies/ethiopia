import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { TaxSeverity } from '@repo/enums';

interface BadgeDemoProps {
  severity?: TaxSeverity;
  children: ReactNode;
}

const AppBadge = ({
  severity = TaxSeverity.Neutral,
  children,
}: BadgeDemoProps): ReactNode => {
  const severityClasses = {
    [TaxSeverity.Error]:
      'bg-destructive text-destructive-foreground hover:bg-destructive/80',
    [TaxSeverity.Information]: 'bg-blue-500 text-white hover:bg-blue-600',
    [TaxSeverity.Neutral]: '', // Default badge styling
    [TaxSeverity.Warning]: 'bg-yellow-500 text-black hover:bg-yellow-600',
    [TaxSeverity.Success]: 'bg-green-500 text-white hover:bg-green-600',
  };

  return <Badge className={cn(severityClasses[severity])}>{children}</Badge>;
};

export default AppBadge;
