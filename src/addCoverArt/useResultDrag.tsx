import { useDraggable } from "@dnd-kit/core";
import { CSS as CSSUtils } from "@dnd-kit/utilities";

export const useResultDrag = ({
  isDraggable,
  title,
  image,
}: {
  isDraggable: boolean;
  title?: string;
  image?: string;
}) => {
  const { attributes, listeners, transform, setNodeRef } = useDraggable({
    id: "cover-art-result",
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
