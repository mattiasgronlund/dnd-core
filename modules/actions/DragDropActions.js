'use strict';

import { Actions } from 'flummox'
import invariant from 'invariant';
import isObject from 'lodash/lang/isObject';

export default class DragDropActions extends Actions {
  constructor(manager) {
    super();
    this.manager = manager;
  }

  beginDrag(sourceHandle) {
    const { context, registry } = this.manager;
    invariant(
      context.canDrag(sourceHandle),
      'Cannot call beginDrag now. Check context.canDrag(sourceHandle) first.'
    );

    const source = registry.getSource(sourceHandle);
    const item = source.beginDrag(context);
    invariant(isObject(item), 'Item must be an object.');

    registry.pinSource(sourceHandle);
    const { type: itemType } = sourceHandle;
    return { itemType, item, sourceHandle };
  }

  drop(targetHandle) {
    const { context, registry } = this.manager;
    invariant(
      context.canDrop(targetHandle),
      'Cannot call drop now. Check context.canDrop(targetHandle) first.'
    );

    const target = registry.getTarget(targetHandle);

    let dropResult = target.drop(context);
    invariant(
      typeof dropResult === 'undefined' || isObject(dropResult),
      'Drop result must either be an object or undefined.'
    );
    if (typeof dropResult === 'undefined') {
      dropResult = true;
    }

    return { dropResult };
  }

  endDrag() {
    const { context, registry } = this.manager;
    invariant(
      context.canEndDrag(),
      'Cannot call endDrag now. Check context.canEndDrag() first.'
    );

    const source = registry.getPinnedSource();
    source.endDrag(context);
    registry.unpinSource();

    return {};
  }
}