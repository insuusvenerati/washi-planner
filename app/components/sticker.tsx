import type { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import { useDrag } from "react-dnd";

type Props = {
  sticker: string;
} & DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;

export const Sticker = ({ sticker, ...rest }: Props) => {
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: "Sticker",
      item: { sticker },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
        isDragging: monitor.isDragging(),
      }),
    }),
    []
  );

  return (
    <img style={{ opacity }} ref={dragRef} src={`/stickers/${sticker}`} alt={sticker} {...rest} />
  );
};
