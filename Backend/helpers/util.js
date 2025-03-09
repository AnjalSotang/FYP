const getPagination = (page, size) => {
    // Convert page and size to integers, with defaults if not provided
    const limit = size ? parseInt(size, 10) : 3;
    const currentPage = page ? parseInt(page, 10) : 0;
    const offset = (currentPage) * limit;
  
    return { limit, offset };
  };
  
  const getPagingData = (response, page, limit) => {
    // Extract total count and rows from the response object
    const { count: totalItems, rows: data } = response;
  
    // Convert page to an integer and adjust for 1-based page index
    const currentPage = page ? parseInt(page, 10) : 1;
  
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalItems / limit);
  
    return { data, totalItems, totalPages, currentPage };
  };

  module.exports = {
    getPagination,
    getPagingData
  };
  