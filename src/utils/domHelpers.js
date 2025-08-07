import * as htmlToImage from 'html-to-image';

/**
 * Exports a DOM element as a JPEG image.
 * @param {React.RefObject<HTMLElement>} elementRef - The ref of the element to export.
 * @param {string} semester - The semester, used for the filename.
 */
export const handleExport = async (elementRef, semester) => {
    const buttonContainer = document.querySelector(".calendar-controls-container");
    if (buttonContainer) buttonContainer.style.display = 'none';

    if (elementRef.current) {
        try {
            const dataUrl = await htmlToImage.toJpeg(elementRef.current, { quality: 0.95 });
            const link = document.createElement('a');
            link.download = `${semester || 'Calendar'} of events.jpg`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error("Image export failed:", error);
            alert("Sorry, there was an error exporting the image.");
        } finally {
            if (buttonContainer) buttonContainer.style.display = 'flex';
        }
    }
};
