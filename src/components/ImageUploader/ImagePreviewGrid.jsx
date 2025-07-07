// ImagePreviewGrid.js
// A reusable component that renders either a scrollable or grid-based view of uploaded images.
// Includes drag-and-drop support for scrollable layout using @hello-pangea/dnd.
// In v0.1.2 "Documentation Reset" CSS files have been separated.

import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ImagePreview from './ImagePreview';
import styles from './ImagePreviewGrid.module.css';

/**
 * ImagePreviewGrid
 * Renders a grid or scrollable row of image cards, optionally draggable.
 *
 * @param {Object[]} images - List of image objects (must contain a `previewUrl`).
 * @param {Function} setImages - Setter to update image order after drag/drop.
 * @param {Function} handleRemoveImage - Removes an image from the list.
 * @param {string} layout - "scroll" (default) or "grid" for layout style.
 */
const ImagePreviewGrid = ({
  handleRemoveImage,
  images,
  setImages,
  layout = 'scroll'
}) => {

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(images);
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);
    setImages(reordered);
  };

  if (layout === 'grid') {
    return (
      <div className={styles.gridContainer}>
        {images.map((image, index) => (
          <div key={image.previewUrl} className={styles.gridItem}>
            <ImagePreview
              handleRemoveImage={handleRemoveImage}
              image={image}
              index={index}
            />
          </div>
        ))}
      </div>
    );
  }

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
                      handleRemoveImage={handleRemoveImage}
                      image={image}
                      index={index}
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
