import React from "react";
import styled from "styled-components";
import NavBar from "../components/NavBar";

const Container = styled.div`
  background: ${({ theme }) => theme.background};
  color: black;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function NotFound() {
  return (
    <>
      <NavBar />
      <Container>
        <h2>404 - Page Not Found</h2>
      </Container>
    </>
  );
}

export default NotFound; 