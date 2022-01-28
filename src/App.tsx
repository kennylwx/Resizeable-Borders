import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import styled from "@emotion/styled";

import {
  resizeWindow,
  startRightDrag,
  startBottomDrag,
  startLeftDrag,
  endDrag,
  onDrag,
  collapseLeftDrag,
  collapseBottomDrag,
  collapseRightDrag,
  addEvent,
} from "./utils/borderResize";

const Container = styled.div({
  height: "100vh",
  background: "none",
  display: "grid",
  gridTemplateAreas: `"header header header header header"
  "leftcol leftdragbar tabpages rightdragbar rightcol"
  "leftcol leftdragbar bottomdragbar rightdragbar rightcol"
  "leftcol leftdragbar footer rightdragbar rightcol"`,
  gridTemplateRows: "min-content 7fr 10px 2fr",
  gridTemplateColumns: "min-content 10px 6fr 10px 4fr",
});

const Header = styled.div({
  background: "orange",
});

const Column = styled.div({
  background: "blue",
});

const Footer = styled.div({
  background: "yellow",
});

const Dragbar = styled.div({
  background: "gray",
});

const Draghandle = styled.div({
  background: "black",
  width: "40px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  alignItems: "center",
});

const Page = styled.div({
  background: "purple",
});

function App() {
  useEffect(() => {
    window.addEventListener("resize", (event: UIEvent) => {
      resizeWindow(event);
    });
    // eslint-disable-next-line no-unused-vars
    return () => {
      window.removeEventListener("resize", resizeWindow);
    };
  });

  // add mouseout event listener to 'document' when App first mount
  useEffect(() => {
    const mouseOutCallback = (e: MouseEvent) => {
      const from = e.relatedTarget || e.target;
      if (!from || (from as Element).nodeName === "HTML") {
        endDrag();
      }
    };

    addEvent(document, "mouseout", mouseOutCallback);

    return () => {
      document.removeEventListener("mouseout", mouseOutCallback);
    };
  }, []);

  return (
    <Container
      id="page"
      onMouseUp={endDrag}
      role="button"
      tabIndex={-1}
      onMouseMove={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
        onDrag(event)
      }
    >
      <Header id="header" style={{ gridArea: "header" }} />

      <Page id="tabpages" style={{ gridArea: "tabpages" }} />
      <Footer id="footer" style={{ gridArea: "footer" }} />

      {/* Columns */}
      <Column id="leftcol" style={{ gridArea: "leftcol" }}>
        HELLO
      </Column>
      <Column id="rightcol" style={{ gridArea: "rightcol" }} />

      {/* Dragbars */}
      <Dragbar
        id="leftdragbar"
        style={{ gridArea: "leftdragbar" }}
        tabIndex={-1}
        aria-label="Move left drag bar"
        onDoubleClick={(
          event: React.MouseEvent<HTMLDivElement, MouseEvent>
        ) => {
          collapseLeftDrag(event);
        }}
        onMouseDown={startLeftDrag}
        role="button"
      >
        <Draghandle id="leftdraghandle" />
      </Dragbar>
      <Dragbar
        id="rightdragbar"
        style={{ gridArea: "rightdragbar" }}
        aria-label="Move right drag bar"
        onDoubleClick={(
          event: React.MouseEvent<HTMLDivElement, MouseEvent>
        ) => {
          collapseRightDrag(event);
        }}
        onMouseDown={startRightDrag}
        role="button"
      >
        <Draghandle id="draghandle" />
      </Dragbar>
      <Dragbar
        id="bottomdragbar"
        style={{ gridArea: "bottomdragbar" }}
        aria-label="Move bottom drag bar"
        onDoubleClick={(
          event: React.MouseEvent<HTMLDivElement, MouseEvent>
        ) => {
          collapseBottomDrag(event);
        }}
        onMouseDown={startBottomDrag}
        role="button"
      >
        <Draghandle id="draghandle" />
      </Dragbar>
    </Container>
  );
}

export default App;
