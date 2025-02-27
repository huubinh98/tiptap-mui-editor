import {
    useCallback,
    useEffect,
    type Dispatch,
    type SetStateAction,
} from "react";
import { makeStyles } from "tss-react/mui";
  
  type ResizableVideoResizerProps = {
    className?: string;
    onResize: (event: MouseEvent) => void;
    mouseDown: boolean;
    setMouseDown: Dispatch<SetStateAction<boolean>>;
  };
  
  const useStyles = makeStyles({ name: { ResizableVideoResizer } })((theme) => ({
    root: {
      position: "absolute",
      bottom: -3,
      right: -3,
      width: 12,
      height: 12,
      background: theme.palette.primary.main,
      cursor: "nwse-resize",
    },
  }));
  
  export function ResizableVideoResizer({
    onResize,
    className,
    mouseDown,
    setMouseDown,
  }: ResizableVideoResizerProps) {
    const { classes, cx } = useStyles();
  
    useEffect(() => {
      if (!mouseDown) {
        return;
      }
  
      const handleMouseMove = (event: MouseEvent) => {
        onResize(event);
      };
  
      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, [mouseDown, onResize]);
  
    useEffect(() => {
      const handleMouseUp = () => {
        setMouseDown(false);
      };
  
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }, [setMouseDown]);
  
    const handleMouseDown = useCallback(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_event: React.MouseEvent) => {
        setMouseDown(true);
      },
      [setMouseDown]
    );
  
    return (
      <div
        className={cx(classes.root, className)}
        onMouseDown={handleMouseDown}
      />
    );
  }