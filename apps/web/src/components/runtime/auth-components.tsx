'use client';

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useSiteAuth } from './site-auth-provider';

// ============================================================================
// LOGIN FORM RUNTIME
// ============================================================================

interface LoginFormRuntimeProps {
  title?: string;
  subtitle?: string;
  showRemember?: boolean;
  showForgotPassword?: boolean;
  showRegisterLink?: boolean;
  registerUrl?: string;
  forgotPasswordUrl?: string;
  redirectAfterLogin?: string;
  buttonText?: string;
  variant?: 'card' | 'inline' | 'minimal';
  emailLabel?: string;
  passwordLabel?: string;
  successMessage?: string;
  errorMessage?: string;
}

export function LoginFormRuntime({
  title = 'Anmelden',
  subtitle = 'Melde dich mit deinem Konto an.',
  showRemember = true,
  showForgotPassword = true,
  showRegisterLink = true,
  registerUrl = '/register',
  forgotPasswordUrl = '/forgot-password',
  redirectAfterLogin = '/',
  buttonText = 'Anmelden',
  variant = 'card',
  emailLabel = 'E-Mail',
  passwordLabel = 'Passwort',
}: LoginFormRuntimeProps) {
  const { login, isAuthenticated, user } = useSiteAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  if (isAuthenticated) {
    return (
      <div className={variant === 'card' ? 'rounded-lg border bg-card p-6 shadow-sm' : ''}>
        <p className="text-center text-muted-foreground">
          Du bist bereits angemeldet als <strong>{user?.name || user?.email}</strong>.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Anmeldung fehlgeschlagen.');
    } else if (redirectAfterLogin && redirectAfterLogin !== '/') {
      window.location.href = redirectAfterLogin;
    }
  };

  const containerClass =
    variant === 'card'
      ? 'rounded-lg border bg-card p-6 shadow-sm max-w-md mx-auto'
      : variant === 'inline'
      ? 'max-w-md mx-auto'
      : '';

  return (
    <div className={containerClass}>
      {(title || subtitle) && (
        <div className="mb-6 text-center">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 dark:bg-red-950 p-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">{emailLabel}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@beispiel.de"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{passwordLabel}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center justify-between">
          {showRemember && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-input"
              />
              Angemeldet bleiben
            </label>
          )}
          {showForgotPassword && (
            <a href={forgotPasswordUrl} className="text-sm text-primary hover:underline">
              Passwort vergessen?
            </a>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Wird angemeldet...' : buttonText}
        </button>

        {showRegisterLink && (
          <p className="text-center text-sm text-muted-foreground">
            Noch kein Konto?{' '}
            <a href={registerUrl} className="text-primary hover:underline">
              Jetzt registrieren
            </a>
          </p>
        )}
      </form>
    </div>
  );
}

// ============================================================================
// REGISTER FORM RUNTIME
// ============================================================================

interface RegisterFormRuntimeProps {
  title?: string;
  subtitle?: string;
  showName?: boolean;
  showLoginLink?: boolean;
  loginUrl?: string;
  redirectAfterRegister?: string;
  buttonText?: string;
  variant?: 'card' | 'inline' | 'minimal';
  showTerms?: boolean;
  termsUrl?: string;
  privacyUrl?: string;
  nameLabel?: string;
  emailLabel?: string;
  passwordLabel?: string;
  confirmPasswordLabel?: string;
  showPasswordStrength?: boolean;
  minPasswordLength?: number;
}

export function RegisterFormRuntime({
  title = 'Registrieren',
  subtitle = 'Erstelle ein neues Konto.',
  showName = true,
  showLoginLink = true,
  loginUrl = '/login',
  redirectAfterRegister = '/',
  buttonText = 'Konto erstellen',
  variant = 'card',
  showTerms = false,
  termsUrl = '/agb',
  privacyUrl = '/datenschutz',
  nameLabel = 'Name',
  emailLabel = 'E-Mail',
  passwordLabel = 'Passwort',
  confirmPasswordLabel = 'Passwort bestätigen',
  showPasswordStrength = true,
  minPasswordLength = 8,
}: RegisterFormRuntimeProps) {
  const { register, isAuthenticated, user } = useSiteAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(!showTerms);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return (
      <div className={variant === 'card' ? 'rounded-lg border bg-card p-6 shadow-sm' : ''}>
        <p className="text-center text-muted-foreground">
          Du bist bereits angemeldet als <strong>{user?.name || user?.email}</strong>.
        </p>
      </div>
    );
  }

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < minPasswordLength) {
      setError(`Das Passwort muss mindestens ${minPasswordLength} Zeichen lang sein.`);
      return;
    }
    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }
    if (showTerms && !acceptTerms) {
      setError('Bitte akzeptiere die Nutzungsbedingungen.');
      return;
    }

    setLoading(true);
    const result = await register({ email, password, name: name || undefined });
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Registrierung fehlgeschlagen.');
    } else if (redirectAfterRegister && redirectAfterRegister !== '/') {
      window.location.href = redirectAfterRegister;
    }
  };

  const containerClass =
    variant === 'card'
      ? 'rounded-lg border bg-card p-6 shadow-sm max-w-md mx-auto'
      : variant === 'inline'
      ? 'max-w-md mx-auto'
      : '';

  return (
    <div className={containerClass}>
      {(title || subtitle) && (
        <div className="mb-6 text-center">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 dark:bg-red-950 p-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {showName && (
          <div className="space-y-2">
            <label className="text-sm font-medium">{nameLabel}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Max Mustermann"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">{emailLabel}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@beispiel.de"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{passwordLabel}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={minPasswordLength}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {showPasswordStrength && password.length > 0 && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full ${
                      level <= passwordStrength.level
                        ? passwordStrength.level <= 1
                          ? 'bg-red-500'
                          : passwordStrength.level <= 2
                          ? 'bg-yellow-500'
                          : passwordStrength.level <= 3
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{passwordStrength.label}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{confirmPasswordLabel}</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {showTerms && (
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="rounded border-input mt-0.5"
            />
            <span>
              Ich akzeptiere die{' '}
              <a href={termsUrl} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                Nutzungsbedingungen
              </a>{' '}
              und die{' '}
              <a href={privacyUrl} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                Datenschutzerklärung
              </a>
              .
            </span>
          </label>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Wird erstellt...' : buttonText}
        </button>

        {showLoginLink && (
          <p className="text-center text-sm text-muted-foreground">
            Bereits ein Konto?{' '}
            <a href={loginUrl} className="text-primary hover:underline">
              Anmelden
            </a>
          </p>
        )}
      </form>
    </div>
  );
}

// ============================================================================
// PASSWORD RESET FORM RUNTIME
// ============================================================================

interface PasswordResetFormRuntimeProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  variant?: 'card' | 'inline' | 'minimal';
  loginUrl?: string;
  showLoginLink?: boolean;
  emailLabel?: string;
}

export function PasswordResetFormRuntime({
  title = 'Passwort vergessen?',
  subtitle = 'Gib deine E-Mail-Adresse ein und wir senden dir einen Link.',
  buttonText = 'Link senden',
  variant = 'card',
  loginUrl = '/login',
  showLoginLink = true,
  emailLabel = 'E-Mail',
}: PasswordResetFormRuntimeProps) {
  const { requestPasswordReset } = useSiteAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await requestPasswordReset(email);
      if (result.success) {
        setSent(true);
      } else {
        setError(result.error || 'Anfrage fehlgeschlagen.');
      }
    } catch {
      setError('Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  const containerClass =
    variant === 'card'
      ? 'rounded-lg border bg-card p-6 shadow-sm max-w-md mx-auto'
      : variant === 'inline'
      ? 'max-w-md mx-auto'
      : '';

  if (sent) {
    return (
      <div className={containerClass}>
        <div className="text-center space-y-2">
          <div className="h-12 w-12 mx-auto rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">E-Mail gesendet!</h3>
          <p className="text-sm text-muted-foreground">
            Falls ein Konto mit <strong>{email}</strong> existiert, erhältst du in Kürze eine E-Mail mit weiteren Anweisungen.
          </p>
          {showLoginLink && (
            <a href={loginUrl} className="text-sm text-primary hover:underline">
              Zurück zur Anmeldung
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {(title || subtitle) && (
        <div className="mb-6 text-center">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 dark:bg-red-950 p-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">{emailLabel}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@beispiel.de"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Wird gesendet...' : buttonText}
        </button>

        {showLoginLink && (
          <p className="text-center text-sm text-muted-foreground">
            <a href={loginUrl} className="text-primary hover:underline">
              Zurück zur Anmeldung
            </a>
          </p>
        )}
      </form>
    </div>
  );
}

// ============================================================================
// USER PROFILE RUNTIME
// ============================================================================

interface UserProfileRuntimeProps {
  variant?: 'card' | 'inline' | 'sidebar';
  showAvatar?: boolean;
  showName?: boolean;
  showEmail?: boolean;
  showBio?: boolean;
  editable?: boolean;
  showChangePassword?: boolean;
  showDeleteAccount?: boolean;
  title?: string;
  saveButtonText?: string;
  avatarSize?: 'sm' | 'md' | 'lg' | 'xl';
  showJoinDate?: boolean;
  showRole?: boolean;
}

export function UserProfileRuntime({
  variant = 'card',
  showAvatar = true,
  showName = true,
  showEmail = true,
  showBio = true,
  editable = true,
  title = 'Mein Profil',
  saveButtonText = 'Speichern',
  avatarSize = 'lg',
  showJoinDate = true,
  showRole = false,
}: UserProfileRuntimeProps) {
  const { user, isAuthenticated, loading, updateProfile } = useSiteAuth();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const bioRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSave = async () => {
    setSaveError('');
    setSaveSuccess(false);
    setSaving(true);
    try {
      const data: Record<string, string> = {};
      if (nameRef.current) data.name = nameRef.current.value;
      if (bioRef.current) data.bio = bioRef.current.value;
      const result = await updateProfile(data);
      if (result.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(result.error || 'Speichern fehlgeschlagen.');
      }
    } catch {
      setSaveError('Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 p-6">
        <div className="h-16 w-16 rounded-full bg-muted" />
        <div className="h-4 w-48 bg-muted rounded" />
        <div className="h-4 w-32 bg-muted rounded" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className={variant === 'card' ? 'rounded-lg border bg-card p-6 shadow-sm' : ''}>
        <p className="text-center text-muted-foreground">
          Du musst angemeldet sein, um dein Profil zu sehen.
        </p>
      </div>
    );
  }

  const sizeMap = { sm: 'h-10 w-10', md: 'h-14 w-14', lg: 'h-20 w-20', xl: 'h-28 w-28' };
  const textSizeMap = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl', xl: 'text-3xl' };

  const containerClass =
    variant === 'card'
      ? 'rounded-lg border bg-card p-6 shadow-sm max-w-lg mx-auto'
      : variant === 'sidebar'
      ? 'space-y-4'
      : 'max-w-lg mx-auto';

  return (
    <div className={containerClass}>
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}

      <div className="space-y-6">
        {showAvatar && (
          <div className="flex justify-center">
            <div className={`${sizeMap[avatarSize]} rounded-full bg-muted flex items-center justify-center ${textSizeMap[avatarSize]} font-bold`}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name || ''} className={`${sizeMap[avatarSize]} rounded-full object-cover`} />
              ) : (
                (user.name?.[0] ?? user.email[0] ?? '?').toUpperCase()
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {showName && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              {editable ? (
                <input
                  ref={nameRef}
                  type="text"
                  defaultValue={user.name || ''}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              ) : (
                <p className="font-medium">{user.name || '—'}</p>
              )}
            </div>
          )}

          {showEmail && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">E-Mail</label>
              <p className="text-sm">{user.email}</p>
            </div>
          )}

          {showBio && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Bio</label>
              {editable ? (
                <textarea
                  ref={bioRef}
                  defaultValue={user.bio || ''}
                  placeholder="Erzähle etwas über dich..."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                />
              ) : (
                <p className="text-sm">{user.bio || '—'}</p>
              )}
            </div>
          )}

          {showRole && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Rolle</label>
              <p className="text-sm">
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                  {user.role}
                </span>
              </p>
            </div>
          )}

          {showJoinDate && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Mitglied seit</label>
              <p className="text-sm">
                {new Date(user.createdAt).toLocaleDateString('de-DE', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>

        {saveError && (
          <div className="rounded-md border border-red-200 bg-red-50 dark:bg-red-950 p-3 text-sm text-red-700 dark:text-red-300">
            {saveError}
          </div>
        )}
        {saveSuccess && (
          <div className="rounded-md border border-green-200 bg-green-50 dark:bg-green-950 p-3 text-sm text-green-700 dark:text-green-300">
            Profil erfolgreich gespeichert!
          </div>
        )}

        {editable && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? 'Wird gespeichert...' : saveButtonText}
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// USER AVATAR RUNTIME
// ============================================================================

interface UserAvatarRuntimeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  showRole?: boolean;
  namePosition?: 'right' | 'below';
  showDropdown?: boolean;
  profileUrl?: string;
  logoutRedirect?: string;
  showLoginButton?: boolean;
  loginUrl?: string;
  loginButtonText?: string;
}

export function UserAvatarRuntime({
  size = 'md',
  showName = true,
  showRole = false,
  namePosition = 'right',
  showDropdown = true,
  profileUrl = '/profil',
  logoutRedirect = '/',
  showLoginButton = true,
  loginUrl = '/login',
  loginButtonText = 'Anmelden',
}: UserAvatarRuntimeProps) {
  const { user, isAuthenticated, logout } = useSiteAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!isAuthenticated || !user) {
    if (showLoginButton) {
      return (
        <a
          href={loginUrl}
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-9 px-4 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {loginButtonText}
        </a>
      );
    }
    return null;
  }

  const sizeMap = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-14 w-14 text-lg',
    xl: 'h-20 w-20 text-2xl',
  };

  const avatarEl = (
    <div
      className={`${sizeMap[size]} rounded-full bg-muted flex items-center justify-center font-medium cursor-pointer`}
      onClick={() => showDropdown && setDropdownOpen(!dropdownOpen)}
    >
      {user.avatar ? (
        <img src={user.avatar} alt={user.name || ''} className={`${sizeMap[size]} rounded-full object-cover`} />
      ) : (
        ((user.name?.[0]) || user.email[0] || '?').toUpperCase()
      )}
    </div>
  );

  const nameEl = showName && (
    <div className={namePosition === 'below' ? 'text-center mt-1' : ''}>
      <div className="text-sm font-medium">{user.name || user.email}</div>
      {showRole && (
        <div className="text-xs text-muted-foreground">{user.role}</div>
      )}
    </div>
  );

  return (
    <div className={`relative inline-flex ${namePosition === 'right' ? 'items-center gap-2' : 'flex-col items-center'}`}>
      {avatarEl}
      {nameEl}

      {showDropdown && dropdownOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 min-w-[160px] rounded-md border bg-popover p-1 shadow-md">
            <a
              href={profileUrl}
              className="block w-full rounded-sm px-3 py-2 text-sm hover:bg-accent text-left"
            >
              Mein Profil
            </a>
            <div className="my-1 h-px bg-border" />
            <button
              onClick={async () => {
                await logout();
                if (logoutRedirect) window.location.href = logoutRedirect;
              }}
              className="block w-full rounded-sm px-3 py-2 text-sm hover:bg-accent text-left text-red-600"
            >
              Abmelden
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// LOGOUT BUTTON RUNTIME
// ============================================================================

interface LogoutButtonRuntimeProps {
  text?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg';
  redirectTo?: string;
  confirmLogout?: boolean;
  confirmMessage?: string;
  showIcon?: boolean;
  fullWidth?: boolean;
}

export function LogoutButtonRuntime({
  text = 'Abmelden',
  variant = 'outline',
  size = 'md',
  redirectTo = '/',
  confirmLogout = false,
  confirmMessage = 'Möchtest du dich wirklich abmelden?',
  showIcon = true,
  fullWidth = false,
}: LogoutButtonRuntimeProps) {
  const { logout, isAuthenticated } = useSiteAuth();
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) return null;

  const variantClasses: Record<string, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    link: 'text-primary underline-offset-4 hover:underline',
  };
  const sizeClasses: Record<string, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-11 px-8',
  };

  const handleLogout = async () => {
    if (confirmLogout && !window.confirm(confirmMessage)) return;
    setLoading(true);
    await logout();
    if (redirectTo) window.location.href = redirectTo;
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors gap-2 disabled:opacity-50 ${
        variantClasses[variant]
      } ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''}`}
    >
      {showIcon && (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      )}
      {loading ? 'Wird abgemeldet...' : text}
    </button>
  );
}

// ============================================================================
// PROTECTED CONTENT RUNTIME
// ============================================================================

interface ProtectedContentRuntimeProps {
  requiredRole?: 'any' | 'admin' | 'moderator' | 'member' | 'vip';
  showFallback?: boolean;
  fallbackMessage?: string;
  showLoginButton?: boolean;
  loginUrl?: string;
  loginButtonText?: string;
  hideCompletely?: boolean;
  children: React.ReactNode;
}

export function ProtectedContentRuntime({
  requiredRole = 'any',
  showFallback = true,
  fallbackMessage = 'Du musst angemeldet sein, um diesen Inhalt zu sehen.',
  showLoginButton = true,
  loginUrl = '/login',
  loginButtonText = 'Jetzt anmelden',
  hideCompletely = false,
  children,
}: ProtectedContentRuntimeProps) {
  const { user, isAuthenticated, loading } = useSiteAuth();

  if (loading) {
    return (
      <div className="animate-pulse p-4">
        <div className="h-24 bg-muted rounded" />
      </div>
    );
  }

  const hasAccess = (() => {
    if (!isAuthenticated || !user) return false;
    if (requiredRole === 'any') return true;
    const roleHierarchy: Record<string, number> = {
      ADMIN: 4,
      MODERATOR: 3,
      VIP: 2,
      MEMBER: 1,
    };
    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole.toUpperCase()] || 0;
    return userLevel >= requiredLevel;
  })();

  if (hasAccess) return <>{children}</>;
  if (hideCompletely) return null;

  if (showFallback) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center space-y-3">
        <svg className="h-10 w-10 mx-auto text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-muted-foreground">{fallbackMessage}</p>
        {showLoginButton && (
          <a
            href={loginUrl}
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-9 px-4 text-sm font-medium hover:bg-primary/90"
          >
            {loginButtonText}
          </a>
        )}
      </div>
    );
  }

  return null;
}

// ============================================================================
// MEMBER LIST RUNTIME
// ============================================================================

interface MemberListRuntimeProps {
  layout?: 'grid' | 'list' | 'compact';
  columns?: number;
  showAvatar?: boolean;
  showName?: boolean;
  showRole?: boolean;
  showBio?: boolean;
  showJoinDate?: boolean;
  pageSize?: number;
  showSearch?: boolean;
  filterByRole?: string;
  title?: string;
  showPagination?: boolean;
  avatarSize?: 'sm' | 'md' | 'lg';
  linkToProfile?: boolean;
  profileUrlPattern?: string;
  // Context from renderer
  slug?: string;
  /** @deprecated Use `slug` instead */
  siteSlug?: string;
}

export function MemberListRuntime({
  layout = 'grid',
  columns = 3,
  showAvatar = true,
  showName = true,
  showRole = true,
  showBio = false,
  showJoinDate = false,
  pageSize = 20,
  showSearch = false,
  filterByRole,
  title = 'Unsere Mitglieder',
  showPagination = true,
  avatarSize = 'md',
  slug: slugProp,
  siteSlug,
}: MemberListRuntimeProps) {
  const { slug: contextSlug } = useSiteAuth();
  const slug = slugProp || siteSlug || contextSlug;
  const sizeMap = { sm: 'h-8 w-8', md: 'h-12 w-12', lg: 'h-16 w-16' };

  const [members, setMembers] = useState<Array<{ id: string; name: string | null; avatar: string | null; bio: string | null; role: string; createdAt: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));
    if (search) params.set('search', search);
    if (filterByRole) params.set('role', filterByRole);

    fetch(`/api/runtime/workspaces/${slug}/auth/members?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setMembers(data.members || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setError('');
      })
      .catch(() => setError('Mitglieder konnten nicht geladen werden.'))
      .finally(() => setLoading(false));
  }, [slug, page, pageSize, search, filterByRole]);

  const colMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-bold">{title}</h2>}

      {showSearch && (
        <input
          type="text"
          placeholder="Mitglieder suchen..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {loading ? (
        <div className={layout === 'grid' ? `grid ${colMap[columns] || 'grid-cols-3'} gap-4` : 'space-y-2'}>
          {Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4 animate-pulse">
              <div className={`${sizeMap[avatarSize]} rounded-full bg-muted mx-auto mb-2`} />
              <div className="h-4 w-24 bg-muted rounded mx-auto" />
            </div>
          ))}
        </div>
      ) : members.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-8">
          {search ? 'Keine Mitglieder gefunden.' : 'Noch keine Mitglieder.'}
        </p>
      ) : (
        <div className={layout === 'grid' ? `grid ${colMap[columns] || 'grid-cols-3'} gap-4` : 'space-y-2'}>
          {members.map((member) => (
            <div
              key={member.id}
              className={`rounded-lg border p-4 ${
                layout === 'list' ? 'flex items-center gap-4' : 'text-center space-y-2'
              }`}
            >
              {showAvatar && (
                <div className={`${sizeMap[avatarSize]} rounded-full bg-muted mx-auto flex items-center justify-center text-muted-foreground overflow-hidden`}>
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name || ''} className={`${sizeMap[avatarSize]} rounded-full object-cover`} />
                  ) : (
                    <span className="font-bold text-sm">
                      {(member.name?.[0] ?? '?').toUpperCase()}
                    </span>
                  )}
                </div>
              )}
              <div>
                {showName && <p className="font-medium text-sm">{member.name || 'Anonym'}</p>}
                {showRole && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {member.role}
                  </span>
                )}
                {showBio && member.bio && (
                  <p className="text-xs text-muted-foreground mt-1">{member.bio}</p>
                )}
                {showJoinDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Seit {new Date(member.createdAt).toLocaleDateString('de-DE', { month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showPagination && totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1 text-sm rounded-md border hover:bg-muted disabled:opacity-50"
          >
            Zurück
          </button>
          <span className="px-3 py-1 text-sm text-muted-foreground">
            Seite {page} von {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 text-sm rounded-md border hover:bg-muted disabled:opacity-50"
          >
            Weiter
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

function getPasswordStrength(password: string): { level: number; label: string } {
  if (password.length === 0) return { level: 0, label: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: 'Schwach' };
  if (score <= 2) return { level: 2, label: 'Mittel' };
  if (score <= 3) return { level: 3, label: 'Stark' };
  return { level: 4, label: 'Sehr stark' };
}
