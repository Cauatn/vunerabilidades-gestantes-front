import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      richColors
      icons={{
        success: <CircleCheckIcon className='size-4' />,
        info: <InfoIcon className='size-4' />,
        warning: <TriangleAlertIcon className='size-4' />,
        error: <OctagonXIcon className='size-4' />,
        loading: <Loader2Icon className='size-4 animate-spin' />,
      }}
      position='top-center'
      style={
        {
          '--normal-bg': 'var(--n-0)',
          '--normal-text': 'var(--n-900)',
          '--normal-border': 'var(--n-30)',
          '--border-radius': 'var(--radius)',

          '--success-bg': 'var(--g-50)',
          '--success-text': 'var(--g-700)',
          '--success-border': 'var(--g-200)',

          '--error-bg': 'var(--r-50)',
          '--error-text': 'var(--r-700)',
          '--error-border': 'var(--r-200)',

          '--warning-bg': 'var(--y-50)',
          '--warning-text': 'var(--y-700)',
          '--warning-border': 'var(--y-200)',

          '--info-bg': 'var(--b-50)',
          '--info-text': 'var(--b-700)',
          '--info-border': 'var(--b-200)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
