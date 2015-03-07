'use strict';

import invariant from 'invariant';

export default class DragDropContext {
  constructor(flux, registry) {
    this.dragOperationStore = flux.dragOperationStore;
    this.registry = registry;
  }

  addChangeListener(listener, context) {
    this.dragOperationStore.addListener('change', listener, context);
    this.registry.addListener('change', listener, context);
  }

  removeChangeListener(listener, context) {
    this.dragOperationStore.removeListener('change', listener, context);
    this.registry.removeListener('change', listener, context);
  }

  canDrag(sourceHandle) {
    const source = this.registry.getSource(sourceHandle);
    invariant(source, 'Expected to find a valid source.');

    if (this.isDragging()) {
      return false;
    }

    return source.canDrag(this);
  }

  canDrop(targetHandle) {
    const target = this.registry.getTarget(targetHandle);
    invariant(target, 'Expected to find a valid target.');

    if (!this.isDragging() || this.didDrop()) {
      return false;
    }

    const { type: targetType } = targetHandle;
    const draggedItemType = this.getDraggedItemType();

    return targetType === draggedItemType &&
           target.canDrop(this);
  }

  canEndDrag() {
    return this.isDragging();
  }

  isDragging(sourceHandle) {
    const isDragging = this.dragOperationStore.isDragging();
    if (!isDragging || typeof sourceHandle === 'undefined') {
      return isDragging;
    }

    const { type: sourceType } = sourceHandle;
    const draggedItemType = this.getDraggedItemType();
    if (sourceType !== draggedItemType) {
      return false;
    }

    let source = this.registry.getSource(sourceHandle, true);
    if (!source) {
      return false;
    }

    return source.isDragging(this);
  }

  isDraggedSource(source) {
    return source === this.registry.getPinnedSource();
  }

  getDraggedItemType() {
    return this.dragOperationStore.getDraggedItemType();
  }

  getDraggedItem() {
    return this.dragOperationStore.getDraggedItem();
  }

  getDropResult() {
    return this.dragOperationStore.getDropResult();
  }

  didDrop() {
    return this.dragOperationStore.didDrop();
  }
}