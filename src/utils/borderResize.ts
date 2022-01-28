import React from "react";

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

let isLeftDragging = false;
let isRightDragging = false;
let isBottomDragging = false;

// Resizing internal border
const ROW_INTERNAL: RCE_STATUS = "ROW_INTERNAL";
const COL_INTERNAL: RCE_STATUS = "COL_INTERNAL";

// Resizing external (window)
const ROW_EXTERNAL: RCE_STATUS = "ROW_EXTERNAL";
const COL_EXTERNAL: RCE_STATUS = "COL_EXTERNAL";

// Collapsing each internal border
const COLLAPSE_LEFT: RCE_STATUS = "COLLAPSE_LEFT";
const COLLAPSE_RIGHT: RCE_STATUS = "COLLAPSE_RIGHT";
const COLLAPSE_BOTTOM: RCE_STATUS = "COLLAPSE_BOTTOM";

// Expanding from collapsed internal border
const EXPAND_LEFT: RCE_STATUS = "EXPAND_LEFT";
const EXPAND_RIGHT: RCE_STATUS = "EXPAND_RIGHT";
const EXPAND_BOTTOM: RCE_STATUS = "EXPAND_BOTTOM";

// Cursor Type
const COL_RESIZE_CURSOR = "col-resize";
const ROW_RESIZE_CURSOR = "row-resize";
const AUTO_CURSOR = "auto";

// Expanding Column and Row Sizes
const EXPAND_COL_RIGHT_SIZE = 360;
const EXPAND_COL_LEFT_SIZE = 190;
const EXPAND_ROW_BOTTOM_SIZE = 190;

// Assign cursor to different styles
export const setCursor = (cursor: string) => {
  const page: HTMLElement | null = document.getElementById("page");

  if (page !== null) {
    page.style.cursor = cursor;
  }
};

// This section pertains to resizing internal borders with dragbars
export const startLeftDrag = () => {
  isLeftDragging = true;
  setCursor(COL_RESIZE_CURSOR);
};

export const startRightDrag = () => {
  isRightDragging = true;
  setCursor(COL_RESIZE_CURSOR);
};

export const startBottomDrag = () => {
  isBottomDragging = true;
  setCursor(ROW_RESIZE_CURSOR);
};

export const endDrag = () => {
  isLeftDragging = false;
  isRightDragging = false;
  isBottomDragging = false;
  setCursor(AUTO_CURSOR);
};

const addUnitToList = (list: string[] | number[], unit: string): string =>
  list.map((c) => `${c.toString()}${unit}`).join(" ");

const addUnitToNum = (num: number, unit: string): string =>
  `${num.toString()}${unit}`;

const getDefn = (page: HTMLElement, list: number[], status: string): string => {
  let tempList = addUnitToList(list, "px");

  switch (status) {
    case ROW_INTERNAL:
      break;
    case COL_INTERNAL:
      break;
    case ROW_EXTERNAL:
      tempList = addUnitToList(
        [
          addUnitToNum(list[0], "px"),
          addUnitToNum(list[1] / (list[1] + list[3]), "fr"),
          addUnitToNum(list[2], "px"),
          addUnitToNum(list[3] / (list[1] + list[3]), "fr"),
        ],
        ""
      );

      break;
    case COL_EXTERNAL:
      tempList = addUnitToList(
        [
          addUnitToNum(list[0] / (list[0] + list[2] + list[4]), "fr"),
          addUnitToNum(list[1], "px"),
          addUnitToNum(list[2] / (list[0] + list[2] + list[4]), "fr"),
          addUnitToNum(list[3], "px"),
          addUnitToNum(list[4] / (list[0] + list[2] + list[4]), "fr"),
        ],
        ""
      );
      break;
    case COLLAPSE_LEFT:
      tempList = addUnitToList(
        [
          addUnitToNum(0, "px"),
          addUnitToNum(list[1], "px"),
          addUnitToNum(list[2] / (list[2] + list[4]), "fr"),
          addUnitToNum(list[3], "px"),
          addUnitToNum(list[4] / (list[2] + list[4]), "fr"),
        ],
        ""
      );
      break;
    case COLLAPSE_RIGHT:
      tempList = addUnitToList(
        [
          addUnitToNum(list[0] / (list[0] + list[2]), "fr"),
          addUnitToNum(list[1], "px"),
          addUnitToNum(list[2] / (list[0] + list[2]), "fr"),
          addUnitToNum(list[3], "px"),
          addUnitToNum(0, "px"),
        ],
        ""
      );
      break;
    case COLLAPSE_BOTTOM:
      tempList = addUnitToList(
        [
          addUnitToNum(list[0], "px"),
          addUnitToNum(list[1] / list[1], "fr"),
          addUnitToNum(list[2], "px"),
          addUnitToNum(0, "px"),
        ],
        ""
      );
      break;
    case EXPAND_LEFT:
      tempList = addUnitToList(
        [
          addUnitToNum(EXPAND_COL_LEFT_SIZE, "px"),
          addUnitToNum(list[1], "px"),
          addUnitToNum(list[2] / (list[2] + list[4]), "fr"),
          addUnitToNum(list[3], "px"),
          addUnitToNum(list[4] / (list[2] + list[4]), "fr"),
        ],
        ""
      );
      break;
    case EXPAND_RIGHT:
      tempList = addUnitToList(
        [
          addUnitToNum(list[0] / (list[0] + list[2]), "fr"),
          addUnitToNum(list[1], "px"),
          addUnitToNum(list[2] / (list[0] + list[2]), "fr"),
          addUnitToNum(list[3], "px"),
          addUnitToNum(EXPAND_COL_RIGHT_SIZE, "px"),
        ],
        ""
      );
      break;
    case EXPAND_BOTTOM:
      tempList = addUnitToList(
        [
          addUnitToNum(list[0], "px"),
          addUnitToNum(list[1] / list[1], "fr"),
          addUnitToNum(list[2], "px"),
          addUnitToNum(EXPAND_ROW_BOTTOM_SIZE, "px"),
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
  const leftcol = document.getElementById("leftcol");
  const rightcol = document.getElementById("rightcol");
  const leftDragbar = document.getElementById("leftdragbar");
  const rightDragbar = document.getElementById("rightdragbar");

  if (
    leftcol === null ||
    rightcol === null ||
    leftDragbar === null ||
    rightDragbar === null
  ) {
    return "";
  }

  const leftColWidth = isLeftDragging ? event.clientX : leftcol.offsetWidth;
  const rightColWidth = isRightDragging
    ? page.clientWidth - event.clientX
    : rightcol.offsetWidth;

  const cols = [
    leftColWidth,
    leftDragbar.offsetWidth,
    page.clientWidth -
      (leftDragbar.offsetWidth + rightDragbar.offsetWidth) -
      leftColWidth -
      rightColWidth,
    rightDragbar.offsetWidth,
    rightColWidth,
  ];

  return getDefn(page, cols, status);
};

const getRowDefn = (
  page: HTMLElement,
  event: React.MouseEvent,
  status: RCE_STATUS
): string => {
  const footer = document.getElementById("footer");
  const header = document.getElementById("header");
  const bottomDragbar = document.getElementById("bottomdragbar");

  if (footer === null || header === null || bottomDragbar === null) {
    return "";
  }

  const bottomRowHeight = isBottomDragging
    ? page.clientHeight - event.clientY
    : footer.offsetHeight;

  const rows = [
    header.offsetHeight,
    page.clientHeight -
      bottomDragbar.offsetHeight -
      bottomRowHeight -
      header.offsetHeight,
    bottomDragbar.offsetHeight,
    bottomRowHeight,
  ];

  return getDefn(page, rows, status);
};

export const onDrag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  const page: HTMLElement | null = document.getElementById("page");

  if (page === null) {
    return;
  }

  if (isLeftDragging || isRightDragging) {
    const newColDefn = getColDefn(page, event, COL_INTERNAL);
    page.style.gridTemplateColumns = newColDefn;
  } else if (isBottomDragging) {
    const newRowDefn = getRowDefn(page, event, ROW_INTERNAL);
    page.style.gridTemplateRows = newRowDefn;
  }

  event.preventDefault();
};

// Column and Row threshold before collapsing or expanding
const MIN_COL_THRESHOLD = 100;
const MIN_ROW_THRESHOLD = 125;

// This section pertains to collapsing the dragbars
export const collapseLeftDrag = (
  event: React.MouseEvent<HTMLDivElement, MouseEvent>
) => {
  const page: HTMLElement | null = document.getElementById("page");
  const leftcol: HTMLElement | null = document.getElementById("leftcol");

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

export const collapseRightDrag = (
  event: React.MouseEvent<HTMLDivElement, MouseEvent>
) => {
  const page: HTMLElement | null = document.getElementById("page");
  const rightcol: HTMLElement | null = document.getElementById("rightcol");

  if (page === null || rightcol === null) {
    return;
  }

  let col;

  if (rightcol.clientWidth < MIN_COL_THRESHOLD) {
    col = getColDefn(page, event, EXPAND_RIGHT);
  } else {
    col = getColDefn(page, event, COLLAPSE_RIGHT);
  }

  page.style.gridTemplateColumns = col;
};

export const collapseBottomDrag = (
  event: React.MouseEvent<HTMLDivElement, MouseEvent>
) => {
  const page: HTMLElement | null = document.getElementById("page");
  const footer: HTMLElement | null = document.getElementById("footer");

  if (page === null || footer === null) {
    return;
  }

  let row;

  if (footer.clientHeight < MIN_ROW_THRESHOLD) {
    row = getRowDefn(page, event, EXPAND_BOTTOM);
  } else {
    row = getRowDefn(page, event, COLLAPSE_BOTTOM);
  }

  page.style.gridTemplateRows = row;
};

// This section pertains to resizing the window
export const resizeWindow = (event: UIEvent | React.MouseEvent) => {
  const page: HTMLElement | null = document.getElementById("page");
  if (page !== null) {
    const col = getColDefn(page, event as React.MouseEvent, COL_EXTERNAL);
    const row = getRowDefn(page, event as React.MouseEvent, ROW_EXTERNAL);
    page.style.gridTemplateColumns = col;
    page.style.gridTemplateRows = row;
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
