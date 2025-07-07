// ImagePreviewGrid.js
// A resusable component that renders a scrollable and future update layout view of the uploaded images.
// Each image is draggable for resorting of page order using @hello-pangea/dnd
// In v0.1.2 "Documentation Reset" css files have been seperated.
import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ImagePreview from './ImagePreview';
import styles from './ImagePreviewGrid.module.css';

/**
 * ImagePreviewGrid
 * A horizontally scrollable grid of image cards with drag-and-drop support.
 *
 * @param {Object[]} images - List of image objects (each must contain a `previewUrl`).
 * @param {Function} setImages - Setter to update image list after reordering.
 * @param {Function} handleRemoveImage - Handler to remove an image from the list.
 */
const ImagePreviewGrid = ({ handleRemoveImage, images, setImages }) => {

  /**
   * Handles the reordering of images after a drag-and-drop event.
   * @param {Object} result - The drag event result from react-beautiful-dnd.
   */
  const handleDragEnd = (result) => {
    // Exit early if the item was dropped outside of a valid area
    if (!result.destination) return;

    // Create a shallow copy of the array and update order
    const reordered = Array.from(images);
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);

    // Update parent state with new image order
    setImages(reordered);
  };

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
