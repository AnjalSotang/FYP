// Helper function to format time and date
const formatDateTime = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
  
    // Format time as hh:mm AM/PM
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const time = created.toLocaleTimeString('en-US', timeOptions);
  
    // Strip time to compare date only
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const createdDate = new Date(created.getFullYear(), created.getMonth(), created.getDate());
  
    const diffInTime = nowDate - createdDate;
    const diffInDays = diffInTime / (1000 * 60 * 60 * 24);
  
    let date;
    if (diffInDays === 0) {
      date = 'Today';
    } else if (diffInDays === 1) {
      date = 'Yesterday';
    } else {
      const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      date = created.toLocaleDateString('en-US', dateOptions);
    }
  
    return { time, date };
  };
  
 module.exports = {
    formatDateTime,
  };