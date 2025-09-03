const response = await fetch('./contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData),
});

if (response.ok) {
  setSubmitStatus('success');
  setFormData({ name: '', email: '', subject: '', message: '' });
} else {
  setSubmitStatus('error');
}