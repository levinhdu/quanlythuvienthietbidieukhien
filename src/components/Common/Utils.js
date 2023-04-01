import { DragSource, DropTarget } from 'react-dnd';
import BodyRow from 'src/components/common/BodyRow';

export default class Utils {
  static rowSource = {
    beginDrag(props) {
      return {
        index: props.index
      };
    }
  };

  static rowTarget = {
    drop(props, monitor) {
      const newMonitor = monitor;
      const dragIndex = monitor.getItem().index;
      const hoverIndex = props.index;
      if (dragIndex === hoverIndex) {
        return;
      }
      props.moveRow(dragIndex, hoverIndex);
      newMonitor.getItem().index = hoverIndex;
    }
  };

  static DragableBodyRow = DropTarget('row', Utils.rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset()
  }))(
    DragSource('row', Utils.rowSource, (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      dragRow: monitor.getItem(),
      clientOffset: monitor.getClientOffset(),
      initialClientOffset: monitor.getInitialClientOffset()
    }))(BodyRow)
  );

  static dragDirection = (
    dragIndex,
    hoverIndex,
    initialClientOffset,
    clientOffset,
    sourceClientOffset
  ) => {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
    const hoverClientY = clientOffset.y - sourceClientOffset.y;
    if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
      return 'downward';
    }
    if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
      return 'upward';
    }
    return '';
  }
}
