import styled, { css } from "styled-components";
import { COLOR_DARK, COLOR_PRIMARY, PADDING } from "./theme";

export const NormalText = css`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: ${ COLOR_PRIMARY };
`

export const EmphasizedText = css`
  font-weight: 400;
  font-size: 14px;
  line-height: ${ PADDING / 2 }px;
`

export const Title = styled.div`
  font-weight: 700;
  font-size: ${ PADDING / 2 }px;
  line-height: ${ PADDING / 2 }px;
  color: ${ COLOR_DARK };
  padding: ${ PADDING }px 0 0 ${ PADDING }px;
`

export const SubTitle = styled.div`
  ${ NormalText };
  padding: ${ PADDING / 2 }px ${ PADDING }px 0 ${ PADDING }px;
`

export const HintsText = styled.div`
  ${ NormalText };
  padding: ${ PADDING / 2 }px ${ PADDING }px ${ PADDING }px ${ PADDING }px;
`
