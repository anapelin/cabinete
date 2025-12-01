// Medical Booking System - Auth Component
const { useState, useEffect } = React;

// Color theme - Medical teal/emerald theme
const colors = {
  primary: '#0d9488',       // Teal 600
  primaryHover: '#0f766e',  // Teal 700
  primaryLight: '#ccfbf1',  // Teal 100
  primaryBg: '#f0fdfa',     // Teal 50
  secondary: '#10b981',     // Emerald 500
  secondaryLight: '#d1fae5', // Emerald 100
  accent: '#6366f1',        // Indigo 500
  danger: '#ef4444',        // Red 500
  dangerLight: '#fef2f2',   // Red 50
  dangerBorder: '#fecaca',  // Red 200
  success: '#22c55e',       // Green 500
  successLight: '#f0fdf4',  // Green 50
  successBorder: '#bbf7d0', // Green 200
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  white: '#ffffff',
};

// CNP Validation Function - CNAS Compatible
const validateCNP = (cnp) => {
  const cleanCnp = cnp.replace(/[\s\-]/g, '');
  if (!/^\d{13}$/.test(cleanCnp)) return false;
  const controlString = '279146358279';
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCnp[i]) * parseInt(controlString[i]);
  }
  let controlDigit = sum % 11;
  if (controlDigit === 10) controlDigit = 1;
  return parseInt(cleanCnp[12]) === controlDigit;
};

// Phone Validation Function
const validatePhone = (phone) => {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return /^(07\d{8}|(\+4|04)07\d{8})$/.test(cleanPhone);
};

// Icon styles - fixed size to prevent overflow
const iconStyle = { width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', flexShrink: 0 };
const iconStyleLarge = { width: '24px', height: '24px', minWidth: '24px', minHeight: '24px', flexShrink: 0 };

// Icons with inline styles
const UserIcon = () => (
  <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockIcon = () => (
  <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const MailIcon = () => (
  <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const AlertIcon = () => (
  <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CheckIcon = () => (
  <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

// Medical cross icon for branding
const MedicalCrossIcon = () => (
  <svg style={{ width: '40px', height: '40px' }} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
  </svg>
);

const AuthComponent = () => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Login form
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
    remember: false,
  });

  // Register form
  const [registerData, setRegisterData] = useState({
    cnp: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
  });

  // Form validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // Check if user is already logged in
  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const response = await fetch(mbs_ajax.rest_base + '/auth/me', {
        method: 'GET',
        headers: {
          'X-WP-Nonce': mbs_ajax.rest_nonce,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
      }
    } catch (err) {
      // User not logged in, which is fine
    }
  };

  const validateLoginForm = () => {
    const errors = {};

    if (!loginData.identifier) {
      errors.identifier = 'Vă rugăm introduceți CNP, email sau telefon';
    }

    if (!loginData.password) {
      errors.password = 'Vă rugăm introduceți parola';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegisterForm = () => {
    const errors = {};

    // CNP validation
    if (!registerData.cnp) {
      errors.cnp = 'CNP este obligatoriu';
    } else if (!validateCNP(registerData.cnp)) {
      errors.cnp = 'CNP invalid (trebuie să fie 13 cifre valide)';
    }

    // Email validation
    if (!registerData.email) {
      errors.email = 'Email este obligatoriu';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      errors.email = 'Adresă email invalidă';
    }

    // Password validation
    if (!registerData.password) {
      errors.password = 'Parola este obligatorie';
    } else if (registerData.password.length < 8) {
      errors.password = 'Parola trebuie să aibă minim 8 caractere';
    }

    if (!registerData.confirmPassword) {
      errors.confirmPassword = 'Confirmați parola';
    } else if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Parolele nu coincid';
    }

    // Name validation
    if (!registerData.first_name) {
      errors.first_name = 'Prenume este obligatoriu';
    }

    if (!registerData.last_name) {
      errors.last_name = 'Nume este obligatoriu';
    }

    // Phone validation (optional, but if provided must be valid)
    if (registerData.phone && !validatePhone(registerData.phone)) {
      errors.phone = 'Format telefon invalid (ex: 0712345678)';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateLoginForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(mbs_ajax.rest_base + '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': mbs_ajax.rest_nonce,
        },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Eroare la autentificare');
      }

      setSuccess(data.message || 'Autentificare reușită!');
      setCurrentUser(data.user);
      
      // Redirect after 1 second
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateRegisterForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(mbs_ajax.rest_base + '/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': mbs_ajax.rest_nonce,
        },
        credentials: 'include',
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Eroare la înregistrare');
      }

      setSuccess(data.message || 'Înregistrare reușită!');
      setCurrentUser(data.user);
      
      // Redirect after 1 second
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // WordPress logout - redirect to wp-login.php?action=logout
    window.location.href = mbs_ajax.ajax_url.replace('admin-ajax.php', '../wp-login.php?action=logout');
  };

  // Common styles
  const styles = {
    container: {
      maxWidth: '420px',
      margin: '0 auto',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.04)',
      padding: '32px',
      border: `1px solid ${colors.gray100}`,
    },
    header: {
      textAlign: 'center',
      marginBottom: '28px',
    },
    logoContainer: {
      width: '64px',
      height: '64px',
      backgroundColor: colors.primaryLight,
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      color: colors.primary,
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: colors.gray800,
      margin: '0 0 4px 0',
    },
    subtitle: {
      fontSize: '14px',
      color: colors.gray500,
      margin: 0,
    },
    tabContainer: {
      display: 'flex',
      backgroundColor: colors.gray100,
      borderRadius: '10px',
      padding: '4px',
      marginBottom: '24px',
    },
    tab: (active) => ({
      flex: 1,
      padding: '10px 16px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: active ? colors.white : 'transparent',
      color: active ? colors.primary : colors.gray500,
      boxShadow: active ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
    }),
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    label: {
      fontSize: '13px',
      fontWeight: '600',
      color: colors.gray700,
      marginBottom: '4px',
    },
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    inputIcon: {
      position: 'absolute',
      left: '12px',
      color: colors.gray400,
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'none',
    },
    input: (hasError) => ({
      width: '100%',
      padding: '12px 12px 12px 40px',
      border: `2px solid ${hasError ? colors.danger : colors.gray200}`,
      borderRadius: '10px',
      fontSize: '14px',
      color: colors.gray800,
      backgroundColor: colors.white,
      transition: 'border-color 0.2s, box-shadow 0.2s',
      outline: 'none',
      boxSizing: 'border-box',
    }),
    inputNoIcon: (hasError) => ({
      width: '100%',
      padding: '12px',
      border: `2px solid ${hasError ? colors.danger : colors.gray200}`,
      borderRadius: '10px',
      fontSize: '14px',
      color: colors.gray800,
      backgroundColor: colors.white,
      transition: 'border-color 0.2s, box-shadow 0.2s',
      outline: 'none',
      boxSizing: 'border-box',
    }),
    errorText: {
      fontSize: '12px',
      color: colors.danger,
      marginTop: '4px',
    },
    hintText: {
      fontSize: '11px',
      color: colors.gray400,
      marginTop: '4px',
    },
    checkboxRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    checkbox: {
      width: '16px',
      height: '16px',
      accentColor: colors.primary,
      cursor: 'pointer',
    },
    checkboxLabel: {
      fontSize: '13px',
      color: colors.gray600,
      cursor: 'pointer',
    },
    button: (disabled) => ({
      width: '100%',
      padding: '14px',
      backgroundColor: disabled ? colors.gray300 : colors.primary,
      color: colors.white,
      border: 'none',
      borderRadius: '10px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      marginTop: '8px',
    }),
    logoutButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: colors.danger,
      color: colors.white,
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    alertBox: (type) => ({
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '12px 14px',
      borderRadius: '10px',
      marginBottom: '16px',
      backgroundColor: type === 'error' ? colors.dangerLight : colors.successLight,
      border: `1px solid ${type === 'error' ? colors.dangerBorder : colors.successBorder}`,
    }),
    alertText: (type) => ({
      fontSize: '13px',
      color: type === 'error' ? colors.danger : colors.success,
      margin: 0,
      lineHeight: 1.4,
    }),
    gridRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
    },
    userCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '20px',
      padding: '16px',
      backgroundColor: colors.primaryBg,
      borderRadius: '12px',
    },
    userAvatar: {
      width: '56px',
      height: '56px',
      backgroundColor: colors.primary,
      borderRadius: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.white,
    },
    userName: {
      fontSize: '18px',
      fontWeight: '700',
      color: colors.gray800,
      margin: 0,
    },
    userEmail: {
      fontSize: '13px',
      color: colors.gray500,
      margin: '2px 0 0 0',
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: `1px solid ${colors.gray100}`,
    },
    infoLabel: {
      fontSize: '13px',
      color: colors.gray500,
      width: '80px',
      fontWeight: '500',
    },
    infoValue: {
      fontSize: '14px',
      color: colors.gray800,
      fontWeight: '500',
    },
  };

  // If user is logged in, show user info
  if (currentUser) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.logoContainer}>
              <MedicalCrossIcon />
            </div>
            <h1 style={styles.title}>Bun venit!</h1>
            <p style={styles.subtitle}>Contul tău medical</p>
          </div>

          <div style={styles.userCard}>
            <div style={styles.userAvatar}>
              <svg style={{ width: '28px', height: '28px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 style={styles.userName}>{currentUser.display_name}</h2>
              <p style={styles.userEmail}>{currentUser.email}</p>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>CNP:</span>
              <span style={styles.infoValue}>{currentUser.cnp_masked || currentUser.cnp}</span>
            </div>
            {currentUser.phones && currentUser.phones.length > 0 && (
              <div style={{ ...styles.infoRow, borderBottom: 'none' }}>
                <span style={styles.infoLabel}>Telefon:</span>
                <span style={styles.infoValue}>{currentUser.phones[0].phone}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            style={styles.logoutButton}
            onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
            onMouseOut={(e) => e.target.style.backgroundColor = colors.danger}
          >
            Deconectare
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <MedicalCrossIcon />
          </div>
          <h1 style={styles.title}>Cabinet Medical</h1>
          <p style={styles.subtitle}>Sistem de programări online</p>
        </div>

        {/* Tab Toggle */}
        <div style={styles.tabContainer}>
          <button
            style={styles.tab(mode === 'login')}
            onClick={() => {
              setMode('login');
              setError(null);
              setSuccess(null);
              setValidationErrors({});
            }}
          >
            Autentificare
          </button>
          <button
            style={styles.tab(mode === 'register')}
            onClick={() => {
              setMode('register');
              setError(null);
              setSuccess(null);
              setValidationErrors({});
            }}
          >
            Înregistrare
          </button>
        </div>

        {/* Error/Success messages */}
        {error && (
          <div style={styles.alertBox('error')}>
            <span style={{ color: colors.danger }}><AlertIcon /></span>
            <p style={styles.alertText('error')}>{error}</p>
          </div>
        )}

        {success && (
          <div style={styles.alertBox('success')}>
            <span style={{ color: colors.success }}><CheckIcon /></span>
            <p style={styles.alertText('success')}>{success}</p>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>CNP, Email sau Telefon</label>
              <div style={styles.inputWrapper}>
                <div style={styles.inputIcon}><UserIcon /></div>
                <input
                  type="text"
                  value={loginData.identifier}
                  onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                  style={styles.input(validationErrors.identifier)}
                  placeholder="Introduceți CNP, email sau telefon"
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = validationErrors.identifier ? colors.danger : colors.gray200}
                />
              </div>
              {validationErrors.identifier && (
                <p style={styles.errorText}>{validationErrors.identifier}</p>
              )}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Parolă</label>
              <div style={styles.inputWrapper}>
                <div style={styles.inputIcon}><LockIcon /></div>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  style={styles.input(validationErrors.password)}
                  placeholder="Introduceți parola"
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = validationErrors.password ? colors.danger : colors.gray200}
                />
              </div>
              {validationErrors.password && (
                <p style={styles.errorText}>{validationErrors.password}</p>
              )}
            </div>

            <div style={styles.checkboxRow}>
              <input
                type="checkbox"
                id="remember"
                checked={loginData.remember}
                onChange={(e) => setLoginData({ ...loginData, remember: e.target.checked })}
                style={styles.checkbox}
              />
              <label htmlFor="remember" style={styles.checkboxLabel}>
                Ține-mă minte
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={styles.button(loading)}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = colors.primaryHover)}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = colors.primary)}
            >
              {loading ? 'Se autentifică...' : 'Autentificare'}
            </button>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} style={styles.form}>
            <div style={styles.gridRow}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Prenume *</label>
                <input
                  type="text"
                  value={registerData.first_name}
                  onChange={(e) => setRegisterData({ ...registerData, first_name: e.target.value })}
                  style={styles.inputNoIcon(validationErrors.first_name)}
                  placeholder="Ion"
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = validationErrors.first_name ? colors.danger : colors.gray200}
                />
                {validationErrors.first_name && (
                  <p style={styles.errorText}>{validationErrors.first_name}</p>
                )}
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Nume *</label>
                <input
                  type="text"
                  value={registerData.last_name}
                  onChange={(e) => setRegisterData({ ...registerData, last_name: e.target.value })}
                  style={styles.inputNoIcon(validationErrors.last_name)}
                  placeholder="Popescu"
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = validationErrors.last_name ? colors.danger : colors.gray200}
                />
                {validationErrors.last_name && (
                  <p style={styles.errorText}>{validationErrors.last_name}</p>
                )}
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>CNP *</label>
              <div style={styles.inputWrapper}>
                <div style={styles.inputIcon}><UserIcon /></div>
                <input
                  type="text"
                  value={registerData.cnp}
                  onChange={(e) => setRegisterData({ ...registerData, cnp: e.target.value })}
                  style={styles.input(validationErrors.cnp)}
                  placeholder="1234567890123"
                  maxLength="13"
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = validationErrors.cnp ? colors.danger : colors.gray200}
                />
              </div>
              {validationErrors.cnp && (
                <p style={styles.errorText}>{validationErrors.cnp}</p>
              )}
              <p style={styles.hintText}>CNP românesc (13 cifre)</p>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email *</label>
              <div style={styles.inputWrapper}>
                <div style={styles.inputIcon}><MailIcon /></div>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  style={styles.input(validationErrors.email)}
                  placeholder="email@example.com"
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = validationErrors.email ? colors.danger : colors.gray200}
                />
              </div>
              {validationErrors.email && (
                <p style={styles.errorText}>{validationErrors.email}</p>
              )}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Telefon (opțional)</label>
              <div style={styles.inputWrapper}>
                <div style={styles.inputIcon}><PhoneIcon /></div>
                <input
                  type="tel"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  style={styles.input(validationErrors.phone)}
                  placeholder="0712345678"
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = validationErrors.phone ? colors.danger : colors.gray200}
                />
              </div>
              {validationErrors.phone && (
                <p style={styles.errorText}>{validationErrors.phone}</p>
              )}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Parolă *</label>
              <div style={styles.inputWrapper}>
                <div style={styles.inputIcon}><LockIcon /></div>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  style={styles.input(validationErrors.password)}
                  placeholder="••••••••"
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = validationErrors.password ? colors.danger : colors.gray200}
                />
              </div>
              {validationErrors.password && (
                <p style={styles.errorText}>{validationErrors.password}</p>
              )}
              <p style={styles.hintText}>Minim 8 caractere</p>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Confirmă Parola *</label>
              <div style={styles.inputWrapper}>
                <div style={styles.inputIcon}><LockIcon /></div>
                <input
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  style={styles.input(validationErrors.confirmPassword)}
                  placeholder="••••••••"
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = validationErrors.confirmPassword ? colors.danger : colors.gray200}
                />
              </div>
              {validationErrors.confirmPassword && (
                <p style={styles.errorText}>{validationErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={styles.button(loading)}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = colors.primaryHover)}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = colors.primary)}
            >
              {loading ? 'Se înregistrează...' : 'Crează Cont'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// Render the component
const authRoot = document.getElementById('medical-auth-root');
if (authRoot) {
  ReactDOM.createRoot(authRoot).render(<AuthComponent />);
}

