// ImagePreviewGrid.jsx
import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ImagePreview from './ImagePreview';

const ImagePreviewGrid = ({ images, setImages }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updated = Array.from(images);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);
    setImages(updated);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="image-grid" direction="horizontal">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
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
            }}
          >
            {images.map((img, index) => (
              <Draggable
                key={img.previewUrl}
                draggableId={img.previewUrl}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      flex: '0 0 auto',
                      width: '160px',
                    }}
                  >
                    <ImagePreview image={img} index={index} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ImagePreviewGrid;
