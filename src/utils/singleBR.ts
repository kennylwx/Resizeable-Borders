import React from "react";

export const leftColId = "leftcol";
export const rightColId = "rightcol";
export const dragbarId = "dragbar";
export const pageId = "page";

const DRAG_MAX_LIMIT = 500;
const DRAG_MIN_LIMIT = 30;

// Types
export type RESIZE_STATUS =
  | "ROW_INTERNAL"
  | "COL_INTERNAL"
  | "ROW_EXTERNAL"
  | "COL_EXTERNAL";

export type COLLAPSE_STATUS =
  | "COLLAPSE_LEFT"
  | "COLLAPSE_RIGHT"
  | "COLLAPSE_BOTTOM";

export type EXPAND_STATUS = "EXPAND_LEFT" | "EXPAND_RIGHT" | "EXPAND_BOTTOM";

export type RCE_STATUS = RESIZE_STATUS | COLLAPSE_STATUS | EXPAND_STATUS;

let isDragging = false;

// Resizing internal border
const COL_INTERNAL: RCE_STATUS = "COL_INTERNAL";

// Resizing external (window)
const COL_EXTERNAL: RCE_STATUS = "COL_EXTERNAL";

// Collapsing each internal border
const COLLAPSE_LEFT: RCE_STATUS = "COLLAPSE_LEFT";

// Expanding from collapsed internal border
const EXPAND_LEFT: RCE_STATUS = "EXPAND_LEFT";

// Cursor Type
const COL_RESIZE_CURSOR = "col-resize";
const AUTO_CURSOR = "auto";

// Expanding Column and Row Sizes
const EXPAND_COL_LEFT_SIZE = 300;
const COLLAPSE_COL_LEFT_SIZE = DRAG_MIN_LIMIT;

// Assign cursor to different styles
export const setCursor = (cursor: string) => {
  const page: HTMLElement | null = document.getElementById(pageId);

  if (page !== null) {
    page.style.cursor = cursor;
  }
};

// This section pertains to resizing internal borders with dragbars
export const startDrag = () => {
  isDragging = true;
  setCursor(COL_RESIZE_CURSOR);
};

export const endDrag = () => {
  isDragging = false;
  setCursor(AUTO_CURSOR);
};

const addUnitToList = (list: string[] | number[], unit: string): string =>
  list.map((c) => `${c.toString()}${unit}`).join(" ");

const addUnitToNum = (num: number, unit: string): string =>
  `${num.toString()}${unit}`;

const getDefn = (page: HTMLElement, list: number[], status: string): string => {
  let tempList = addUnitToList(list, "px");

  switch (status) {
    case COLLAPSE_LEFT:
      tempList = addUnitToList(
        [
          addUnitToNum(COLLAPSE_COL_LEFT_SIZE, "px"),
          addUnitToNum(list[1], "px"),
          addUnitToNum(list[0] - COLLAPSE_COL_LEFT_SIZE + list[2], "px"),
        ],
        ""
      );
      break;

    case EXPAND_LEFT:
      tempList = addUnitToList(
        [
          addUnitToNum(EXPAND_COL_LEFT_SIZE, "px"),
          addUnitToNum(list[1], "px"),
          addUnitToNum(list[2] - (EXPAND_COL_LEFT_SIZE - list[0]), "px"),
        ],
        ""
      );
      break;
    default:
      break;
  }

  return tempList;
};

const getColDefn = (
  page: HTMLElement,
  event: React.MouseEvent,
  status: RCE_STATUS
): string => {
  const leftcol = document.getElementById(leftColId);
  const rightcol = document.getElementById(rightColId);
  const dragbar = document.getElementById(dragbarId);

  if (leftcol === null || rightcol === null || dragbar === null) {
    return "";
  }

  let leftColWidth: number;

  // Check to see if its being dragged
  if (isDragging) {
    leftColWidth = event.clientX;
  } else {
    leftColWidth = leftcol.offsetWidth;
  }

  // Checked to see if it exceeds threshold
  if (leftColWidth > DRAG_MAX_LIMIT) {
    leftColWidth = DRAG_MAX_LIMIT;
  } else if (leftColWidth < DRAG_MIN_LIMIT) {
    leftColWidth = DRAG_MIN_LIMIT;
  }

  let cols = [
    leftColWidth,
    dragbar.offsetWidth,
    page.clientWidth - dragbar.offsetWidth - leftColWidth,
  ];

  return getDefn(page, cols, status);
};

export const onDrag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  const page: HTMLElement | null = document.getElementById(pageId);

  if (page === null) {
    return;
  }

  if (isDragging) {
    const newColDefn = getColDefn(page, event, COL_INTERNAL);
    page.style.gridTemplateColumns = newColDefn;
  }

  event.preventDefault();
};

const MIN_COL_THRESHOLD = 100;

// This section pertains to collapsing the dragbars
export const collapseDrag = (
  event: React.MouseEvent<HTMLDivElement, MouseEvent>
) => {
  const page: HTMLElement | null = document.getElementById(pageId);
  const leftcol: HTMLElement | null = document.getElementById(leftColId);

  if (page === null || leftcol === null) {
    return;
  }

  let col: string;

  if (leftcol.clientWidth < MIN_COL_THRESHOLD) {
    col = getColDefn(page, event, EXPAND_LEFT);
  } else {
    col = getColDefn(page, event, COLLAPSE_LEFT);
  }
  page.style.gridTemplateColumns = col;
};

// This section pertains to resizing the window
export const resizeWindow = (event: UIEvent | React.MouseEvent) => {
  const page: HTMLElement | null = document.getElementById(pageId);
  if (page !== null) {
    const col = getColDefn(page, event as React.MouseEvent, COL_EXTERNAL);
    page.style.gridTemplateColumns = col;
  }
};

export const addEvent = (
  obj: Document | HTMLElement,
  evt: string,
  fn: (e: MouseEvent) => void
) => {
  if (obj.addEventListener) {
    obj.addEventListener(evt, fn as EventListenerOrEventListenerObject, false);
  }
};
