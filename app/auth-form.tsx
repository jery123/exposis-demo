"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthMode = "login" | "register";
type FieldErrors = Record<string, string[]>;
type AuthResponse = {
  redirectTo?: string;
  message?: string;
  errors?: FieldErrors;
};

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const isLogin = mode === "login";
  const [csrfReady, setCsrfReady] = useState(false);
  const [csrfError, setCsrfError] = useState("");
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    async function prepareSession() {
      try {
        const response = await fetch("/api/auth/csrf", { cache: "no-store" });
        const result: AuthResponse = await response.json();
        if (!response.ok) {
          if (active) setCsrfError(result.message ?? "Le service de connexion est indisponible.");
          return;
        }
        if (active) setCsrfReady(true);
      } catch (error) {
        if (error instanceof TypeError) {
          if (active) setCsrfError("Impossible de joindre le service de connexion. Réessayez plus tard.");
          return;
        }
        throw error;
      }
    }

    void prepareSession();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError("");
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    if (isLogin) payload.remember = String(formData.has("remember"));

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });
      const result: AuthResponse = await response.json();

      if (response.status === 422 && result.errors) {
        setFieldErrors(result.errors);
        setFormError("Vérifiez les champs signalés puis réessayez.");
        return;
      }

      if (response.ok && result.redirectTo) {
        router.replace(result.redirectTo);
        return;
      }

      setFormError(result.message ?? "La demande n’a pas abouti. Veuillez réessayer.");
    } catch (error) {
      if (error instanceof TypeError) {
        setFormError("Le service de connexion est momentanément indisponible.");
        return;
      }
      throw error;
    } finally {
      setSubmitting(false);
    }
  }

  function fieldError(name: string) {
    const messages = fieldErrors[name];
    return messages?.length ? (
      <span className="auth-error" id={`${name}-error`}>{messages.join(" ")}</span>
    ) : null;
  }

  return (
    <div className="auth-page">
      <div className="auth-content">
        <aside className="auth-aside">
          <span className="auth-kicker"><i /> Recherche · Expérimentation · Innovation</span>
          <span aria-hidden="true" className="auth-infinity">∞</span>
          <h1>Les idées avancent<br />mieux <em>ensemble.</em></h1>
          <p>Un espace pour les membres qui apprennent, partagent et construisent des projets utiles avec EXPOSIS.</p>
          <div className="auth-aside-note"><span>EX / CI</span><span>Communauté de recherche · Côte d’Ivoire</span></div>
        </aside>

        <section aria-labelledby="auth-title" className="auth-panel">
          <span aria-hidden="true" className="auth-panel-mark">∞</span>
          <div className="auth-heading">
            <span className="auth-step">{isLogin ? "Espace membre · 01" : "Rejoindre EXPOSIS · 02"}</span>
            <h2 id="auth-title">{isLogin ? "Bon retour parmi nous." : "Faisons connaissance."}</h2>
            <p>
              {isLogin
                ? "Connectez-vous pour retrouver vos projets et la communauté."
                : "Créez votre espace membre pour contribuer aux projets de la communauté."}
            </p>
          </div>

          {csrfError ? (
            <p className="auth-message auth-message-error" role="alert">{csrfError}</p>
          ) : !csrfReady ? (
            <p className="auth-message" role="status">Préparation de votre espace sécurisé…</p>
          ) : null}
          {formError && <p className="auth-message auth-message-error" role="alert">{formError}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="auth-field">
                  <label htmlFor="name">Nom complet</label>
                  <input aria-describedby={fieldErrors.name ? "name-error" : undefined} autoComplete="name" autoFocus id="name" name="name" required />
                  {fieldError("name")}
                </div>
                <div className="auth-field">
                  <label htmlFor="organization_name">Organisation <span>(obligatoire)</span></label>
                  <input aria-describedby={fieldErrors.organization_name ? "organization_name-error" : undefined} autoComplete="organization" id="organization_name" name="organization_name" required />
                  {fieldError("organization_name")}
                </div>
                <div className="auth-field">
                  <label htmlFor="phone">Téléphone <span>(facultatif)</span></label>
                  <input aria-describedby={fieldErrors.phone ? "phone-error" : undefined} autoComplete="tel" id="phone" name="phone" type="tel" />
                  {fieldError("phone")}
                </div>
              </>
            )}
            <div className="auth-field">
              <label htmlFor="email">Adresse e-mail</label>
              <input aria-describedby={fieldErrors.email ? "email-error" : undefined} autoComplete="email" autoFocus={isLogin} id="email" name="email" required type="email" />
              {fieldError("email")}
            </div>
            <div className="auth-field">
              <label htmlFor="password">Mot de passe</label>
              <input aria-describedby={fieldErrors.password ? "password-error" : undefined} autoComplete={isLogin ? "current-password" : "new-password"} id="password" name="password" required type="password" />
              {fieldError("password")}
            </div>
            {!isLogin && (
              <div className="auth-field">
                <label htmlFor="password_confirmation">Confirmer le mot de passe</label>
                <input aria-describedby={fieldErrors.password_confirmation ? "password_confirmation-error" : undefined} autoComplete="new-password" id="password_confirmation" name="password_confirmation" required type="password" />
                {fieldError("password_confirmation")}
              </div>
            )}
            {isLogin && (
              <label className="auth-check" htmlFor="remember">
                <input id="remember" name="remember" type="checkbox" />
                <span>Se souvenir de moi</span>
              </label>
            )}
            <button className="auth-submit" disabled={!csrfReady || Boolean(csrfError) || submitting} type="submit">
              {submitting ? "Connexion en cours…" : isLogin ? "Se connecter" : "Créer mon compte"}
              <span aria-hidden="true">↗</span>
            </button>
          </form>

          <div className="auth-links">
            {isLogin ? (
              <>
                <a href="/forgot-password">Mot de passe oublié ?</a>
                <p>Pas encore membre ? <a href="/register">Créer un compte</a></p>
              </>
            ) : (
              <p>Déjà membre ? <a href="/login">Se connecter</a></p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
