import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import styled from "styled-components";

const AppInput: React.FC = () => {
  return (
    <>
      <Wrapper>
        <StyledInput />
        <SearchOutlined />
      </Wrapper>
    </>
  );
};

export default AppInput;

const StyledInput = styled.input`
  outline: none;
  padding-inline: 10px;
`;

const Wrapper = styled.div`
  padding: 10px;
  border: 1px solid black;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  margin: 10px;
  height: 35px;
`;
