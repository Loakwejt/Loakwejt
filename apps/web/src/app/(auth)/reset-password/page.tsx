'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton } from '@builderly/ui';
import { Layers, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Password validation
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasMinLength = password.length >= 8;
  const passwordsMatch = password === confirmPassword && password.length > 0;

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <Layers className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Builderly</span>
          </Link>
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <CardTitle>Ungültiger Link</CardTitle>
          <CardDescription>
            Dieser Link zum Zurücksetzen des Passworts ist ungültig oder abgelaufen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/forgot-password">
            <Button className="w-full">
              Neuen Link anfordern
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordsMatch) {
      setErrorMessage('Die Passwörter stimmen nicht überein.');
      return;
    }

    if (!hasLowercase || !hasUppercase || !hasNumber || !hasMinLength) {
      setErrorMessage('Das Passwort erfüllt nicht alle Anforderungen.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Fehler beim Zurücksetzen des Passworts.');
        return;
      }

      setIsSuccess(true);
    } catch {
      setErrorMessage('Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <Layers className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Builderly</span>
          </Link>
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle>Passwort geändert</CardTitle>
          <CardDescription>
            Ihr Passwort wurde erfolgreich zurückgesetzt. Sie können sich jetzt mit Ihrem neuen Passwort anmelden.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full"
            onClick={() => router.push('/login')}
          >
            Zur Anmeldung
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
          <Layers className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Builderly</span>
        </Link>
        <CardTitle>Neues Passwort setzen</CardTitle>
        <CardDescription>
          Geben Sie Ihr neues Passwort ein.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {errorMessage}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Neues Passwort</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <div className="text-xs space-y-1 mt-2">
              <PasswordRequirement met={hasMinLength} text="Mindestens 8 Zeichen" />
              <PasswordRequirement met={hasLowercase} text="Mindestens ein Kleinbuchstabe" />
              <PasswordRequirement met={hasUppercase} text="Mindestens ein Großbuchstabe" />
              <PasswordRequirement met={hasNumber} text="Mindestens eine Zahl" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            {confirmPassword && !passwordsMatch && (
              <p className="text-xs text-destructive">Passwörter stimmen nicht überein</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !hasMinLength || !hasLowercase || !hasUppercase || !hasNumber || !passwordsMatch}
          >
            {isLoading ? 'Wird gespeichert...' : 'Passwort ändern'}
          </Button>
        </form>

        <div className="mt-6">
          <Link href="/login">
            <Button variant="ghost" className="w-full text-muted-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Anmeldung
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 ${met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
      {met ? (
        <CheckCircle className="h-3 w-3" />
      ) : (
        <div className="h-3 w-3 rounded-full border border-current" />
      )}
      {text}
    </div>
  );
}

function ResetPasswordFormFallback() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="inline-flex items-center justify-center gap-2 mb-4">
          <Layers className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Builderly</span>
        </div>
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="h-4 w-56 mx-auto mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={<ResetPasswordFormFallback />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
