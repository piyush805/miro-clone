"use client";

// for minimal throttle, we memoize this function
import { memo } from "react";

import { useOthersConnectionIds, useOthersMapped } from "@/liveblocks.config";
import { Cursor } from "./cursor";
import { colorToCss } from "@/lib/utils";
import { Path } from "./path";

const Cursors = () => {
  const ids = useOthersConnectionIds();

  return (
    <>
      {ids.map((connectionId, index) => (
        <Cursor key={connectionId} connectionId={connectionId} />
      ))}
    </>
  );
};

const Drafts = () => {
  const others = useOthersMapped((other) => ({
    pencilDraft: other.presence.pencilDraft,
    penColor: other.presence.penColor,
  }));

  return (
    <>
      {others.map(([key, other]) => {
        if (other.pencilDraft) {
          return (
            <Path
              key={key}
              x={0}
              y={0}
              points={other.pencilDraft}
              fill={other.penColor ? colorToCss(other.penColor) : "#000"}
            />
          );
        }
        return null;
      })}
    </>
  );
};

export const CursorsPresence = memo(() => {
  return (
    <>
      {/* TODO: Add a cursor for the other user */}
      <Drafts />
      <Cursors />
    </>
  );
});

CursorsPresence.displayName = "CursorPresence";
