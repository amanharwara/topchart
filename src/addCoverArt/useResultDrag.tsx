import { useDraggable } from "@dnd-kit/core";
import { CSS as CSSUtils } from "@dnd-kit/utilities";
import { useId } from "react";

export const useResultDrag = ({
  isDraggable,
  title,
  image,
}: {
  isDraggable: boolean;
  image: {
    id: string | undefined;
    content?: string;
  };
  title?: string;
}) => {
  const id = useId();
  const { attributes, listeners, transform, setNodeRef } = useDraggable({
    id: `cover-art-result-${id}`,
    data: {
      title,
      image,
    },
  });

  const dragImageStyle = {
    transform: CSSUtils.Transform.toString(transform),
  };

  return isDraggable
    ? {
        ref: setNodeRef,
        style: dragImageStyle,
        ...attributes,
        ...listeners,
      }
    : {};
};
