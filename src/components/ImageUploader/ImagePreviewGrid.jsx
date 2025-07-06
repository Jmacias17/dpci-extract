// ImagePreviewGrid.jsx
import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ImagePreview from './ImagePreview';

/**
 * ImagePreviewGrid
 * Renders a horizontally scrollable, draggable image grid.
 * @param {Object[]} images - Array of image objects (must contain previewUrl).
 * @param {Function} setImages - Setter to update image order.
 */
const ImagePreviewGrid = ({ handleRemoveImage, images, setImages }) => {

  // Handles item rearrangement when drag ends
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(images);
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);
    setImages(reordered);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="image-grid" direction="horizontal">
        {(dropProvided) => (
          <div
            ref={dropProvided.innerRef}
            {...dropProvided.droppableProps}
            style={containerStyle}
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
                    style={{
                      ...dragProvided.draggableProps.style,
                      ...draggableItemStyle,
                    }}
                  >
                    <ImagePreview handleRemoveImage={handleRemoveImage} image={image} index={index} />
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

const containerStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  gap: '1rem',
  overflowX: 'auto',
  padding: '1rem',
  WebkitOverflowScrolling: 'touch',
  scrollBehavior: 'smooth',
  border: '1px solid #eee',
  borderRadius: '8px',
};

const draggableItemStyle = {
  flex: '0 0 auto',
  width: '160px',
};
