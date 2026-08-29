(() => {
  const input = document.getElementById('localPhotos');
  const preview = document.getElementById('uploadPreview');
  const button = document.getElementById('createEvent');
  if (!input || !button) return;

  input.addEventListener('change', () => {
    const files = [...input.files].filter(f => /^image\/(jpeg|png|webp)$/.test(f.type));
    preview.innerHTML = files.length
      ? `<strong>${files.length} photo${files.length === 1 ? '' : 's'} selected</strong><small>Photos will be stored in this browser for the test.</small>`
      : '<strong>Please choose JPG, PNG or WEBP photos.</strong>';
  });

  // Capture before the old handler in app.js so the new upload flow is reliable.
  button.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const files = [...input.files].filter(f => /^image\/(jpeg|png|webp)$/.test(f.type));
    if (!files.length) {
      preview.innerHTML = '<strong>Please choose at least one photo first.</strong>';
      input.focus();
      return;
    }
    const name = document.getElementById('eventName').value.trim() || 'New Photography Event';
    const date = document.getElementById('eventDate').value || 'Local test';
    button.disabled = true;
    button.textContent = 'Saving photos…';
    try {
      const id = `local-${Date.now()}-${crypto.randomUUID()}`;
      await dbPut('events', { id, name, date, photos: files.length, status: 'READY', createdAt: Date.now() });
      for (const [i, file] of files.entries()) {
        await dbPut('photos', { id: `${id}-${i}-${crypto.randomUUID()}`, eventId: id, name: file.name, mime: file.type, size: file.size, blob: file, createdAt: Date.now() });
      }
      events.unshift({ id, name, date, photos: files.length, status: 'READY', createdAt: Date.now() });
      currentEventId = id;
      renderEvents();
      document.getElementById('eventModal').classList.add('hidden');
      document.getElementById('eventName').value = '';
      document.getElementById('eventDate').value = '';
      input.value = '';
      preview.textContent = 'No photos selected.';
      await openResults();
    } catch (error) {
      console.error(error);
      preview.innerHTML = `<strong>Upload failed: ${String(error.message || error)}</strong>`;
    } finally {
      button.disabled = false;
      button.textContent = 'Create event & upload photos';
    }
  }, true);
})();
