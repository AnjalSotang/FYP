// Utility function to show the error with animation
export const showError = (element) => {
    element.classList.add('fade-in'); // Add the fade-in class for animation
};

// Utility function to hide the error with animation
export const hideError = (element) => {
    element.classList.remove('fade-in'); // Remove the fade-in class when hiding the error
};
