// ImagePreviewGrid.jsx
// Renders a dynamic grid or scrollable row of image previews with optional drag-and-drop reordering.
// Supports both static grid and horizontal scroll layout.
// Introduced drag-and-drop functionality using @hello-pangea/dnd in v0.1.2.

import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ImagePreview from './ImagePreview';
import styles from './ImagePreviewGrid.module.css';

/**
 * ImagePreviewGrid
 *
 * @param {Object[]} images - Array of image objects (must contain `previewUrl` and `pageNumber`)
 * @param {Function} setImages - Updates image order (should re-assign `pageNumber`)
 * @param {Function} handleRemoveImage - Callback to remove an image
 * @param {string} layout - 'scroll' (default) or 'grid' layout style
 * @param {boolean} isDraggable - Enables or disables drag-and-drop
 */
const ImagePreviewGrid = ({
  handleRemoveImage,
  images,
  setImages,
  layout = 'scroll',
  isDraggable = true,
}) => {
  /**
   * Handles drag end event to reorder images and update page numbers
   */
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = [...images];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // Reassign page numbers to reflect new order
    const updated = reordered.map((img, index) => ({
      ...img,
      pageNumber: index + 1,
    }));

    setImages(updated);
  };

  // 🔳 Grid layout (non-draggable)
  if (layout === 'grid') {
    return (
      <div className={styles.gridContainer}>
        {images.map((image, index) => (
          <div key={image.previewUrl} className={styles.gridItem}>
            <ImagePreview
              image={image}
              index={index}
              handleRemoveImage={handleRemoveImage}
            />
          </div>
        ))}
      </div>
    );
  }

  // 🧱 Static scroll layout without drag-and-drop
  if (!isDraggable) {
    return (
      <div className={styles.imageGridContainer}>
        {images.map((image, index) => (
          <div key={image.previewUrl} className={styles.imageDraggable}>
            <ImagePreview
              image={image}
              index={index}
              handleRemoveImage={handleRemoveImage}
              isDraggable={false}
            />
          </div>
        ))}
      </div>
    );
  }

  // 🔄 Scrollable layout with drag-and-drop
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="image-grid" direction="horizontal">
        {(dropProvided) => (
          <div
            ref={dropProvided.innerRef}
            {...dropProvided.droppableProps}
            className={styles.imageGridContainer}
          >
            {images.map((image, index) => (
              <Draggable
                key={image.previewUrl}
                draggableId={image.previewUrl}
                index={index}
              >
                {(dragProvided) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    className={styles.imageDraggable}
                  >
                    <ImagePreview
                      image={image}
                      index={index}
                      handleRemoveImage={handleRemoveImage}
                      isDraggable={true}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {dropProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ImagePreviewGrid;
