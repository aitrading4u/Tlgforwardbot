// steps data (typed by convention via JSDoc)
/**
 * @typedef {Object} Step
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string=} link
 * @property {boolean} checkbox
 */

/** @type {Step[]} */
const steps = [
  { id: "1", title: "1. Crear cuenta en Revolut", description: "Descarga la app Revolut, registra tus datos, verifica tu identidad (KYC) y activa tu cuenta bancaria con IBAN. Sirve para enviar dinero vía SEPA o usar Revolut Pay.", link: "https://www.revolut.com", checkbox: true },
  { id: "2", title: "2. Crear cuenta en Wirex", description: "Regístrate en Wirex, completa KYC y abre una cuenta en EUR/USDT. Desde Wirex puedes enviar dinero vía SEPA o usar su tarjeta.", link: "https://wirexapp.com", checkbox: true },
  { id: "3", title: "3. Crear cuenta en Zen", description: "Abre tu cuenta en Zen (Zen.com), completa la verificación y activa tu tarjeta. También puedes enviar dinero vía SEPA.", link: "https://www.zen.com/", checkbox: true },
  { id: "4", title: "4. Crear cuenta en KuCoin", description: "Entra en KuCoin, regístrate, completa la verificación KYC y activa 2FA con Google Authenticator. Esta será tu exchange principal para comprar USDT.", link: "https://www.kucoin.com/", checkbox: true },
  { id: "5", title: "5. Enviar dinero desde tu banco a KuCoin", description: `Tienes varias opciones:
- Revolut Pay: compra rápida dentro de KuCoin.
- Transferencia SEPA (desde Revolut, Wirex o Zen): en KuCoin ve a "Fiat Deposit → EUR → SEPA". Copia IBAN, Beneficiario y Referencia. IMPORTANTE: no inventes la referencia, cópiala exacta o el dinero no se acreditará.
- Wirex/Zen: usar transferencia bancaria (SEPA).`, checkbox: true },
  { id: "6", title: "6. Comprar USDT en KuCoin", description: "En KuCoin ve a 'Buy Crypto → Fast Trade'. Selecciona EUR → USDT. Confirma y revisa comisiones antes de comprar.", checkbox: true },
  { id: "7", title: "7. Crear cuenta en FXVPS", description: "Contrata tu VPS Windows en FXVPS. Regístrate, paga con tarjeta o crypto y guarda los datos de acceso (IP, usuario, contraseña).", link: "https://secure.fxvps.pro", checkbox: true },
  { id: "8", title: "8. Conectar al VPS", description: `- En PC/Mac: abre "Escritorio remoto" y pega IP, usuario y contraseña.
- En móvil: instala 'Microsoft Remote Desktop' y conecta con los mismos datos.`, checkbox: true },
  { id: "9", title: "9. Crear cuenta en Esperio", description: "Entra en my.esperio.org, regístrate, completa KYC y crea una cuenta Cent en USD. Guarda número de cuenta, contraseña y servidor MT4.", link: "https://my.esperio.org/", checkbox: true },
  { id: "10", title: "10. Depositar USDT en Esperio (desde KuCoin)", description: `1. En Esperio: copia tu dirección de depósito USDT TRC20 (empieza por T...).
2. En KuCoin: ve a 'Assets → Withdraw → USDT'.
3. Añade la dirección de Esperio en red TRC20.
4. Envía primero un test pequeño (5–10 USDT).
5. Confirma con 2FA y email.
6. Comprueba el TXID en TronScan (tronscan.org).`, checkbox: true },
  { id: "11", title: "11. Instalar MT4 en tu VPS", description: "Descarga MT4 desde el portal de Esperio e instálalo en tu VPS. Inicia sesión con tus credenciales (cuenta Cent en USD).", checkbox: true },
  { id: "12", title: "12. Instalar tu bot en MT4", description: `1. Copia el archivo .ex4/.mq4 en: MT4 → Archivo → Abrir carpeta de datos → MQL4 → Experts.
2. Reinicia MT4.
3. Abre gráficos USDJPY (M5) y EURUSD (M5).
4. Arrastra el bot a cada gráfico.
5. Activa AutoTrading y revisa parámetros.`, checkbox: true },
];

function usePersistentChecks(storageKey) {
  const [checkedById, setCheckedById] = React.useState({});

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setCheckedById(JSON.parse(raw));
    } catch {}
  }, [storageKey]);

  React.useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checkedById));
    } catch {}
  }, [storageKey, checkedById]);

  const toggle = React.useCallback((id) => {
    setCheckedById((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const reset = React.useCallback(() => setCheckedById({}), []);

  const markAll = React.useCallback(() => {
    const all = Object.fromEntries(steps.map((s) => [s.id, true]));
    setCheckedById(all);
  }, []);

  return { checkedById, toggle, reset, markAll };
}

function StepsList() {
  const { checkedById, toggle, reset, markAll } = usePersistentChecks("onboarding-steps");
  const completed = Object.values(checkedById).filter(Boolean).length;

  return (
    <div>
      <div className="actions">
        <button className="btn" onClick={markAll}>Marcar todo</button>
        <button className="btn" onClick={reset}>Reiniciar</button>
        <span style={{ marginLeft: 8, color: '#475569' }}>{completed}/{steps.length} completados</span>
      </div>
      <ol>
        {steps.map((s) => (
          <li key={s.id} className="card">
            <label className="label">
              <input
                type="checkbox"
                checked={!!checkedById[s.id]}
                onChange={() => toggle(s.id)}
                style={{ marginTop: 4 }}
              />
              <div style={{ width: '100%' }}>
                <div className="title-row">
                  <div className="step-title">{s.title}</div>
                  {s.link && (
                    <a className="link" href={s.link} target="_blank" rel="noreferrer">Abrir enlace</a>
                  )}
                </div>
                <p className="desc">{s.description}</p>
              </div>
            </label>
          </li>
        ))}
      </ol>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<StepsList />);

