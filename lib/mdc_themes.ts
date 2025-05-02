export interface MDCTheme {
  colors: {
    primary: string;
    secondary: string;
  }
};

export interface MDCThemesList {
  default: MDCTheme;
  vee: MDCTheme;
  chee: MDCTheme;
  Alice: MDCTheme;
}

export const themes = {
  default: {
    colors: {
      primary: 'bg-primary text-primaryForeground',
      secondary: 'bg-secondary text-secondaryForeground'
    }
  },
  vee: {
    colors: {
      primary: 'bg-veePrimary text-veePrimaryForeground',
      secondary: 'bg-veeSecondary text-veeSecondaryForeground'
    }
  },
  chee: {
    colors: {
      primary: 'bg-cheePrimary text-cheePrimaryForeground',
      secondary: 'bg-cheeSecondary text-cheeSecondaryForeground'
    }
  },
  Alice: {
    colors: {
      primary: 'bg-secondary text-secondary-foreground',
      secondary: 'bg-cheeSecondary text-cheeSecondaryForeground'
    }
  }
};