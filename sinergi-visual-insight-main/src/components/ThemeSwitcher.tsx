import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme, ThemeType } from '@/hooks/useTheme';

const themes: { name: string; value: ThemeType; color: string }[] = [
  { name: 'Dark Black', value: 'dark-black', color: 'bg-gray-900' },
  { name: 'Dark Red', value: 'dark-red', color: 'bg-red-900' },
  { name: 'Dark Purple', value: 'dark-purple', color: 'bg-purple-900' },
  { name: 'Dark Red Purple', value: 'dark-red-purple', color: 'bg-gradient-to-r from-red-900 to-purple-900' },
  { name: 'Dark Blue', value: 'dark-blue', color: 'bg-blue-900' },
];

export const ThemeSwitcher = () => {
  const { theme, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="glass-button hover-lift"
      >
        <Palette className="w-4 h-4 mr-2" />
        Tema
      </Button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full right-0 mt-2 z-50"
        >
          <Card className="glass-card border-glass-border/50 p-4 min-w-[200px]">
            <CardContent className="p-0 space-y-2">
              <h3 className="font-orbitron font-bold text-sm mb-3 text-foreground">
                PILIH TEMA
              </h3>
              {themes.map((themeOption) => (
                <Button
                  key={themeOption.value}
                  variant={theme === themeOption.value ? 'default' : 'ghost'}
                  onClick={() => {
                    changeTheme(themeOption.value);
                    setIsOpen(false);
                  }}
                  className="w-full justify-start glass-button text-sm"
                  size="sm"
                >
                  <div className={`w-4 h-4 rounded-full mr-3 ${themeOption.color}`} />
                  {themeOption.name}
                </Button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};