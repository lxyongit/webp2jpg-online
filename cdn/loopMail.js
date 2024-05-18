function consoleResult(result) {
  console.log('result', result)
}
function sendMail(email, count = 1) {
  if (count >= 2) {
    return;
  }
  const script = document.createElement('script')
  script.src =
    `https://email-temporary.com/api/sendTempMail?email=${email}&cb=consoleResult`;
  script.onerror = () => {
    setTimeout(() => {
      sendMail(email, count + 1)
    }, 1000 * 10)
  };
  document.body.appendChild(script);
  setTimeout(() => script.remove(), 1000 * 30);
}
function saveMail(url, next) {
  if(!url || window.preurl === url) {
    return
  }
  window.preurl = url
  const script = document.createElement('script')
  script.src  = `https://email-temporary.com/api/saveBlink?url=${url}&cb=consoleResult`;
  script.onerror = () => {
    !next && saveMail(url, true)
  }
  document.body.appendChild(script);
  setTimeout(() => script.remove(), 1000 * 30);
  const w = window.open(
    `https://pingomatic.com/ping/?title=mailtemp&blogurl=${encodeURIComponent(
      url
    )}&rssurl=&chk_blogs=on&chk_feedburner=on&chk_tailrank=on&chk_superfeedr=on`
  );
  setTimeout(() => w.close(), 1000 * 10);
}

function intervalSendMail(fn) {
  fn()
  return setInterval(() => fn(), 1000 * 60 * 30)
}
function intervalSaveUrl(fn) {
  return setInterval(() => fn(), 1000 * 60 * 5)
}

function create(getEmail, getUrl) {
  return async () => {
    intervalSendMail(async () => sendMail(await getEmail()))
    intervalSaveUrl(async () => saveMail(await getUrl()))
  }
}
