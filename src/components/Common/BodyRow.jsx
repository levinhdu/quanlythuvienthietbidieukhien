import React from 'react';
import Utils from 'src/components/common/Utils';

export default function bodyRow(props) {
  const {
    isOver,
    connectDragSource,
    connectDropTarget,
    moveRow,
    dragRow,
    clientOffset,
    sourceClientOffset,
    initialClientOffset,
    ...restProps
  } = props;
  const style = { ...restProps.style, cursor: 'move' };
  let { className } = restProps;
  if (isOver && initialClientOffset) {
    const direction = Utils.dragDirection(
      dragRow.index,
      restProps.index,
      initialClientOffset,
      clientOffset,
      sourceClientOffset
    );
    if (direction === 'downward') {
      className += ' drop-over-downward';
    }
    if (direction === 'upward') {
      className += ' drop-over-upward';
    }
  }

  return connectDragSource(
    connectDropTarget(
      <tr
        {...restProps}
        className={className}
        style={style}
      />
    )
  );
}

bodyRow.displayName = 'BodyRow';
