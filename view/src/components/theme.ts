import { css } from "styled-components";

export const COLOR_PRIMARY = '#6B6680'
export const COLOR_DARK = '#155FFF'
export const COLOR_SUCCESS = '#FF7DFF'
export const COLOR_ERROR = '#E91E63'

export const PADDING = 36

export const BackgroundGradient = css`
  background: linear-gradient(90deg, ${COLOR_DARK} 0%, ${COLOR_SUCCESS} 52%), white;
`

type color = `#${ string }`
type BoxStyleProps = { backgroundColor?: color, borderColor?: color }

export const BoxStyle = css<BoxStyleProps>`
  background: ${ props => props.backgroundColor || 'white' };
  border: 1px solid ${ props => props.borderColor || '#F1F0F5' };
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.09);
  border-radius: 8px;
`