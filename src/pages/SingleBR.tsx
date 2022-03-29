import { useEffect } from "react";
import styled from "@emotion/styled";

import {
  resizeWindow,
  startDrag,
  endDrag,
  onDrag,
  collapseDrag,
  addEvent,
  leftColId,
  rightColId,
  dragbarId,
} from "../utils/singleBR";

const Container = styled.div({
  height: "100vh",
  background: "none",
  display: "grid",
  gridTemplateAreas: `"${leftColId} ${dragbarId} ${rightColId}"`,
  gridTemplateRows: "1fr",
  gridTemplateColumns: "300px 30px 1fr",
});

const Column = styled.div({
  background: "blue",
});

const Dragbar = styled.div({
  background: "gray",
  cursor: "ew-resize",
});

const Draghandle = styled.div({
  background: "black",
  width: "40px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  alignItems: "center",
});

const SingleBR = (): JSX.Element => {
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
      <Column id={leftColId} style={{ gridArea: leftColId }}>
        Left Column
      </Column>

      <Dragbar
        id="dragbar"
        style={{ gridArea: dragbarId }}
        tabIndex={-1}
        aria-label="Move left drag bar"
        onDoubleClick={(
          event: React.MouseEvent<HTMLDivElement, MouseEvent>
        ) => {
          collapseDrag(event);
        }}
        onMouseDown={startDrag}
        role="button"
      >
        <Draghandle id="draghandle" />
      </Dragbar>
      <Column id={rightColId} style={{ gridArea: rightColId }}>
        Right Column
      </Column>
    </Container>
  );
};

export default SingleBR;
