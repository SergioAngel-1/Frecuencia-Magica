export const colors = {
  fondo:       '#FAFAF5',
  surface:     '#FFFFFF',
  border:      '#E2E2E8',
  primary:     '#FFF0B5',
  secondary:   '#C5E0F7',
  texto:       '#4A4A55',
  textoSoft:   'rgba(74,74,85,0.60)',
  textoMuted:  'rgba(74,74,85,0.35)',

  btn: {
    primary:   { bg: '#FFF0B5', hover: '#FFE894', text: '#4A4A55' },
    secondary: { bg: '#C5E0F7', hover: '#A8D0F0', text: '#4A4A55' },
    outline:   { bg: 'transparent', hover: 'rgba(255,240,181,0.15)', text: '#FFF0B5', border: '#FFF0B5' },
    ghost:     { bg: 'transparent', hover: 'rgba(74,74,85,0.08)', text: '#FFF0B5' },
    surface:   { bg: 'rgba(74,74,85,0.06)', hover: 'rgba(74,74,85,0.10)', text: '#4A4A55' },
  },
};

export const typography = {
  heading: "'Cormorant Garamond', serif",
  body:    "'Inter', sans-serif",
  weights: { light: 300, regular: 400, medium: 500, semibold: 600, bold: 700 },
};

export const spacing = {
  xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px',
};

export const borderRadius = {
  sm: '4px', md: '8px', lg: '12px', xl: '16px', full: '9999px',
};
