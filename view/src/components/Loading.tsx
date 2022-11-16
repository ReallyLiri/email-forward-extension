import styled from "styled-components";
import { COLOR_DARK, PADDING } from "./theme";

const Wrapper = styled.div`
  height: 80%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: ${ PADDING / 2 }px;
  line-height: ${ PADDING / 2 }px;
  color: ${ COLOR_DARK };
`

const Loading = () =>
  <Wrapper>
    <div className="loader"/>
    Loading...
  </Wrapper>;
export default Loading
