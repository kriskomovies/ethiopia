import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  const onClick = () => {
    const themeValue = theme === 'light' ? 'dark' : 'light';
    setTheme(themeValue);
  };

  return (
    <Button variant="outline" size="icon" onClick={onClick}>
      {theme === 'light' ? (
        <Moon className="h-6 w-6" />
      ) : (
        <Sun className="h-6 w-6" />
      )}
    </Button>
  );
}
