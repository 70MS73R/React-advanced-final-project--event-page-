function formatTime(dateTimeString) {
  const dateTime = new Date(dateTimeString);

  // Format the date and time
  const formattedTime = dateTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = dateTime.toLocaleDateString();

  return { date: formattedDate, time: formattedTime };
}

export { formatTime };
