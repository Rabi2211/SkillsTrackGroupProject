// Adds a show/hide "eye" button to every password field on the page.
(function () {
  const EYE_ICON =
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  const EYE_OFF_ICON =
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C5 19 1 12 1 12a20.3 20.3 0 0 1 5.06-5.94"/>' +
    '<path d="M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 8 11 8a20.3 20.3 0 0 1-3.17 4.19"/>' +
    '<path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

  function addToggle(input) {
    const wrapper = document.createElement('span');
    wrapper.style.cssText = 'position:relative;display:block;width:100%;';
    // Keep the wrapper as narrow as the field so the eye stays inside it.
    const maxWidth = getComputedStyle(input).maxWidth;
    if (maxWidth && maxWidth !== 'none') {
      wrapper.style.maxWidth = maxWidth;
    }
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    input.style.paddingRight = '44px';

    const button = document.createElement('button');
    button.type = 'button';
    // Inline styles so each page's own button styles do not affect the eye.
    button.style.cssText =
      'position:absolute;top:50%;right:8px;transform:translateY(-50%);' +
      'width:30px;height:30px;min-width:0;margin:0;padding:0;border:0;border-radius:4px;' +
      'background:transparent;box-shadow:none;color:#333;opacity:0.75;cursor:pointer;' +
      'display:flex;align-items:center;justify-content:center;';

    function render() {
      const hidden = input.type === 'password';
      button.innerHTML = hidden ? EYE_ICON : EYE_OFF_ICON;
      button.setAttribute('aria-label', hidden ? 'Show password' : 'Hide password');
      button.setAttribute('aria-pressed', String(!hidden));
      button.title = hidden ? 'Show password' : 'Hide password';
    }

    button.addEventListener('click', function () {
      input.type = input.type === 'password' ? 'text' : 'password';
      render();
      input.focus();
    });

    // Hide the password again after the form is submitted or reset.
    if (input.form) {
      input.form.addEventListener('reset', function () {
        input.type = 'password';
        render();
      });
    }

    render();
    wrapper.appendChild(button);
  }

  function init() {
    document.querySelectorAll('input[type="password"]').forEach(addToggle);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
