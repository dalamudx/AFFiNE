import { style } from '@vanilla-extract/css';

export const buttonContainer = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontWeight: 500,
});

export const button = style({
  padding: '6px 8px',
  height: 32,
});
