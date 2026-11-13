"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type FieldErrors = Record<string, string[]>;

export default function SubmissionForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setFormError("");
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, FormDataEntryValue | string> = Object.fromEntries(formData.entries());
    payload.confidential = formData.has("confidential") ? "1" : "0";
    payload.consent = formData.has("consent") ? "1" : "0";

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });
      const result: { reference?: string; errors?: FieldErrors } = await response.json();

      if (response.status === 422 && result.errors) {
        setErrors(result.errors);
        setFormError("Vérifiez les champs signalés puis renvoyez votre demande.");
        return;
      }
      if (!response.ok || !result.reference) {
        setFormError("Votre demande n’a pas pu être envoyée. Réessayez dans quelques instants.");
        return;
      }
      router.push(`/soumission-recue?ref=${encodeURIComponent(result.reference)}`);
    } catch (error) {
      if (!(error instanceof TypeError)) throw error;
      setFormError("Le service est momentanément indisponible. Réessayez dans quelques instants.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="submission-form" onSubmit={handleSubmit}>
      <div className="submission-form-heading">
        <span className="section-kicker"><span>Votre proposition</span> Première étape</span>
        <h2>Présentez votre projet</h2>
        <p className="form-required">Les champs marqués d’un * sont obligatoires. Votre idée reste la vôtre et sera étudiée par notre équipe.</p>
      </div>
      {formError && <p className="form-alert" role="alert">{formError}</p>}
      <div className="form-grid">
        <div className="form-section-label form-full">
          <span>01</span><strong>Vous contacter</strong>
        </div>
        <label className="form-field form-full" htmlFor="contact_name">Votre nom *
          <input autoComplete="name" id="contact_name" maxLength={255} name="contact_name" required />
          {errors.contact_name && <span className="field-error">{errors.contact_name.join(" ")}</span>}
        </label>
        <label className="form-field" htmlFor="contact_email">Adresse e-mail *
          <input autoComplete="email" id="contact_email" maxLength={255} name="contact_email" required type="email" />
          {errors.contact_email && <span className="field-error">{errors.contact_email.join(" ")}</span>}
        </label>
        <label className="form-field" htmlFor="contact_phone">Téléphone
          <input autoComplete="tel" id="contact_phone" maxLength={40} name="contact_phone" type="tel" />
          {errors.contact_phone && <span className="field-error">{errors.contact_phone.join(" ")}</span>}
        </label>
        <label className="form-field form-full" htmlFor="contact_organization">Organisation <span className="optional">(facultatif)</span>
          <input autoComplete="organization" id="contact_organization" maxLength={255} name="contact_organization" />
          {errors.contact_organization && <span className="field-error">{errors.contact_organization.join(" ")}</span>}
        </label>
        <div className="form-section-label form-full">
          <span>02</span><strong>Le projet</strong>
        </div>
        <label className="form-field form-full" htmlFor="title">Titre du projet *
          <input id="title" maxLength={150} name="title" required />
          {errors.title && <span className="field-error">{errors.title.join(" ")}</span>}
        </label>
        <label className="form-field form-full" htmlFor="request_type">Type de demande *
          <select defaultValue="" id="request_type" name="request_type" required>
            <option disabled value="">Choisir un type de projet</option>
            <option value="feasibility">Étude de faisabilité technique</option>
            <option value="prototype">Prototype / MVP</option>
            <option value="research">Collaboration de recherche</option>
          </select>
          {errors.request_type && <span className="field-error">{errors.request_type.join(" ")}</span>}
        </label>
        <label className="form-field form-full" htmlFor="problem">Quel problème souhaitez-vous résoudre ? *
          <textarea id="problem" maxLength={2000} name="problem" required rows={3} />
          {errors.problem && <span className="field-error">{errors.problem.join(" ")}</span>}
        </label>
        <label className="form-field form-full" htmlFor="description">Décrivez votre idée ou votre projet *
          <textarea id="description" maxLength={5000} name="description" required rows={5} />
          {errors.description && <span className="field-error">{errors.description.join(" ")}</span>}
        </label>
        <label className="form-field" htmlFor="timeline">Délai souhaité
          <input id="timeline" maxLength={150} name="timeline" placeholder="Ex. 3 à 6 mois" />
          {errors.timeline && <span className="field-error">{errors.timeline.join(" ")}</span>}
        </label>
        <label className="form-field" htmlFor="budget">Budget indicatif
          <input id="budget" maxLength={150} name="budget" placeholder="Ex. à définir" />
          {errors.budget && <span className="field-error">{errors.budget.join(" ")}</span>}
        </label>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Ne pas remplir</label><input autoComplete="off" id="website" name="website" tabIndex={-1} />
      </div>
      <label className="check-field"><input name="confidential" type="checkbox" value="1" /> Certaines informations de ce projet sont confidentielles.</label>
      <label className="check-field check-consent">
        <input name="consent" required type="checkbox" value="1" />
        J’accepte que mes coordonnées et les informations fournies soient utilisées par EXPOSIS pour traiter cette demande. *
      </label>
      {errors.consent && <p className="field-error">{errors.consent.join(" ")}</p>}
      <button className="button button-orange submit-button" disabled={submitting} type="submit">
        {submitting ? "Envoi en cours…" : "Envoyer la demande"} <span aria-hidden="true">↗</span>
      </button>
      <p className="privacy-footnote">Vos coordonnées sont utilisées uniquement pour le suivi de votre demande.</p>
    </form>
  );
}
