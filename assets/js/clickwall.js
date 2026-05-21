(function () {
  var STORAGE_KEY = 'clickwall:accepted';
  var MAX_ENTRIES = 50;

  function readAccepted() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function writeAccepted(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      // ignore: quota, private mode, etc.
    }
  }

  function markAccepted(key) {
    var list = readAccepted().filter(function (k) { return k !== key; });
    list.push(key);
    while (list.length > MAX_ENTRIES) list.shift();
    writeAccepted(list);
  }

  function reveal(wall) {
    wall.classList.add('clickwall-revealed');
    var content = wall.querySelector('[data-clickwall-content]');
    if (content) content.setAttribute('aria-hidden', 'false');
  }

  // How many copy attempts the reader must make before copying really works.
  var UNLOCK_AFTER = 2;

  // Fake-out messages shown on every attempt except the last. Each one claims
  // copying is unlocked... it lies.
  var COPY_MESSAGES = [
    {
      title: '🤖 Hold up!',
      body: 'This is AI-generated content. It may be confidently wrong, so treat ' +
        'it as a thinking trail, not expert advice. Copying is unlocked now. ' +
        'Paste responsibly!'
    },
    {
      title: '📋 Copying AI slop?',
      body: "Bold move. It's all yours now, but don't paste it anywhere that " +
        'matters without checking first. Clipboard unlocked.'
    },
    {
      title: '🚨 Friendly reminder',
      body: 'A robot wrote this, not Fabio. Go ahead and copy it. Just remember ' +
        'to cite the robot. 😅'
    },
    {
      title: '🐙 HUGE if true',
      body: "You really want this text? Fine, it's unlocked. Use it wisely (or " +
        'chaotically, this IS /dev/random).'
    }
  ];

  // The payoff, shown on the final attempt, when copying actually unlocks.
  var FINAL_MESSAGE = {
    title: '🧌 Gotcha!',
    body: 'Made you try twice. OK, OK, it is genuinely unlocked now. ' +
      'Copy away (responsibly, this IS /dev/random).'
  };

  function pickMessage() {
    return COPY_MESSAGES[Math.floor(Math.random() * COPY_MESSAGES.length)];
  }

  // Show the styled "alert" modal. Calls onDismiss once the reader closes it.
  function showToast(msg, onDismiss) {
    var prevFocus = document.activeElement;

    var overlay = document.createElement('div');
    overlay.className = 'clickwall-toast-overlay';

    var toast = document.createElement('div');
    toast.className = 'clickwall-toast';
    toast.setAttribute('role', 'dialog');
    toast.setAttribute('aria-modal', 'true');

    var title = document.createElement('p');
    title.className = 'clickwall-toast-title';
    title.textContent = msg.title;

    var body = document.createElement('p');
    body.className = 'clickwall-toast-body';
    body.textContent = msg.body;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'clickwall-toast-dismiss';
    btn.textContent = 'Got it, let me copy';

    toast.appendChild(title);
    toast.appendChild(body);
    toast.appendChild(btn);
    overlay.appendChild(toast);
    document.body.appendChild(overlay);

    // Force a reflow so the entrance transition runs from the initial state.
    void overlay.offsetWidth;
    overlay.classList.add('is-visible');

    var closed = false;
    function close() {
      if (closed) return;
      closed = true;
      overlay.classList.remove('is-visible');
      document.removeEventListener('keydown', onKey);
      window.setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        if (prevFocus && prevFocus.focus) prevFocus.focus();
        if (onDismiss) onDismiss();
      }, 200);
    }

    function onKey(e) {
      if (e.key === 'Escape') close();
    }

    btn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', onKey);
    btn.focus();
  }

  // Block copy/cut/right-click on the AI content. Each attempt shows a fun
  // alert; copying only really works after UNLOCK_AFTER attempts. Not real
  // protection: anyone can read the source or disable JS.
  function lockContent(content) {
    if (!content) return;
    var events = ['copy', 'cut', 'contextmenu'];
    var attempts = 0;
    var toastOpen = false;

    function unlock() {
      events.forEach(function (evt) {
        content.removeEventListener(evt, onAttempt);
      });
    }

    function onAttempt(e) {
      e.preventDefault();
      if (toastOpen) return;
      toastOpen = true;
      attempts += 1;
      var isFinal = attempts >= UNLOCK_AFTER;
      showToast(isFinal ? FINAL_MESSAGE : pickMessage(), function () {
        toastOpen = false;
        if (isFinal) unlock();
      });
    }

    events.forEach(function (evt) {
      content.addEventListener(evt, onAttempt);
    });
  }

  function init() {
    var walls = document.querySelectorAll('[data-clickwall]');
    var accepted = readAccepted();
    document.querySelectorAll('[data-clickwall-content]').forEach(lockContent);
    walls.forEach(function (wall) {
      var key = wall.getAttribute('data-clickwall-key');
      if (accepted.indexOf(key) !== -1) {
        wall.classList.add('clickwall-accepted');
        var c = wall.querySelector('[data-clickwall-content]');
        if (c) c.setAttribute('aria-hidden', 'false');
        var onEnter = function () {
          reveal(wall);
          wall.removeEventListener('mouseenter', onEnter);
          wall.removeEventListener('touchstart', onEnter);
        };
        wall.addEventListener('mouseenter', onEnter);
        wall.addEventListener('touchstart', onEnter, { passive: true });
        return;
      }
      var btn = wall.querySelector('[data-clickwall-accept]');
      if (!btn) return;
      btn.addEventListener('click', function () {
        markAccepted(key);
        reveal(wall);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
