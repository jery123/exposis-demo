"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { researchAreas } from "@/lib/projects";

type FieldErrors = Record<string, string[]>;
type SubmissionResult = {
  slug?: string;
  status?: string;
  message?: string;
  errors?: FieldErrors;
};

export default function CommunityProjectForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedImageNames, setSelectedImageNames] = useState<string[]>([]);
  const [selectedReportName, setSelectedReportName] = useState("");

  function handleImageSelection(event: ChangeEvent<HTMLInputElement>) {
    setSelectedImageNames(Array.from(event.currentTarget.files ?? [], (file) => file.name));
  }

  function handleReportSelection(event: ChangeEvent<HTMLInputElement>) {
    setSelectedReportName(event.currentTarget.files?.[0]?.name ?? "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setFormError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/community/projects", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(event.currentTarget)
      });
      const result: SubmissionResult = await response.json();

      if (response.status === 422 && result.errors) {
        setErrors(result.errors);
        setFormError("Vérifiez les champs signalés puis renvoyez votre projet.");
        return;
      }
      if (response.status === 401) {
        setFormError("Votre session a expiré. Connectez-vous de nouveau avant d’envoyer votre projet.");
        return;
      }
      if (!response.ok || result.status !== "pending_review") {
        setFormError(result.message ?? "Votre projet n’a pas pu être envoyé. Réessayez dans quelques instants.");
        return;
      }

      router.push("/communaute/projets/nouveau?submitted=1");
    } catch (error) {
      if (!(error instanceof TypeError)) throw error;
      setFormError("Le service est momentanément indisponible. Réessayez dans quelques instants.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="submission-form community-project-form" onSubmit={handleSubmit}>
      <div className="submission-form-heading">
        <span className="section-kicker"><span>Votre contribution</span> Partage avec la communauté</span>
        <h2>Documentez votre projet</h2>
        <p className="form-required">Les champs marqués d’un * sont obligatoires. Ajoutez son rapport : après validation, chacun pourra le consulter librement.</p>
      </div>
      {formError && <p className="form-alert" role="alert">{formError}</p>}
      <div className="form-grid">
        <div className="form-section-label form-full">
          <span>01</span><strong>Le projet</strong>
        </div>
        <label className="form-field form-full" htmlFor="title">Titre du projet *
          <input autoComplete="off" id="title" maxLength={150} name="title" required />
          {errors.title && <span className="field-error">{errors.title.join(" ")}</span>}
        </label>
        <label className="form-field" htmlFor="pole">Domaine *
          <select defaultValue="" id="pole" name="pole" required>
            <option disabled value="">Choisir un domaine</option>
            {researchAreas.map((area) => <option key={area} value={area}>{area}</option>)}
          </select>
          {errors.pole && <span className="field-error">{errors.pole.join(" ")}</span>}
        </label>
        <label className="form-field" htmlFor="status">Avancement *
          <select defaultValue="Prototype" id="status" name="status" required>
            <option value="Recherche">Recherche</option>
            <option value="Prototype">Prototype</option>
            <option value="MVP">MVP</option>
            <option value="Terminé">Terminé</option>
          </select>
          {errors.status && <span className="field-error">{errors.status.join(" ")}</span>}
        </label>
        <label className="form-field form-full" htmlFor="summary">Résumé * <span className="optional">(400 caractères maximum)</span>
          <textarea id="summary" maxLength={400} name="summary" required rows={3} />
          {errors.summary && <span className="field-error">{errors.summary.join(" ")}</span>}
        </label>
        <label className="form-field form-full" htmlFor="body">Description du projet *
          <textarea id="body" maxLength={50000} name="body" required rows={7} />
          {errors.body && <span className="field-error">{errors.body.join(" ")}</span>}
        </label>
        <div className="form-section-label form-full">
          <span>02</span><strong>Les contributeurs</strong>
        </div>
        <label className="form-field form-full" htmlFor="team_members">Participants <span className="optional">(un nom par ligne, 20 maximum)</span>
          <textarea id="team_members" maxLength={2000} name="team_members" placeholder={"Awa Kouamé\nYao N’Guessan"} rows={4} />
          {errors.team_members && <span className="field-error">{errors.team_members.join(" ")}</span>}
          <span className="field-hint">Ajoutez uniquement les membres de l’équipe qui ont accepté de voir leur nom partagé.</span>
        </label>
        <div className="form-section-label form-full">
          <span>03</span><strong>Documents et liens</strong>
        </div>
        <label className="form-field form-full" htmlFor="repo_url">Lien du projet <span className="optional">(facultatif : site, démonstration, dépôt ou documentation)</span>
          <input autoComplete="url" id="repo_url" maxLength={255} name="repo_url" placeholder="https://…" type="url" />
          {errors.repo_url && <span className="field-error">{errors.repo_url.join(" ")}</span>}
        </label>
        <label className="form-field form-full" htmlFor="images">Images du projet <span className="optional">(facultatif, 5 images maximum · JPG, PNG ou WebP · 5 Mo par image)</span>
          <input accept="image/jpeg,image/png,image/webp" id="images" multiple name="images[]" onChange={handleImageSelection} type="file" />
          {Object.entries(errors)
            .filter(([field]) => field === "images" || field.startsWith("images."))
            .flatMap(([field, messages]) => messages.map((message, index) => (
              <span className="field-error" key={`${field}-${index}`}>{message}</span>
            )))}
          {selectedImageNames.length > 0 && (
            <ul className="selected-image-list" aria-live="polite">
              {selectedImageNames.map((name, index) => <li key={`${name}-${index}`}>{name}</li>)}
            </ul>
          )}
          <span className="field-hint">Les images resteront privées jusqu’à la validation du projet par l’équipe EXPOSIS.</span>
        </label>
        <label className="form-field form-full" htmlFor="report">Rapport du projet <span className="optional">(facultatif · PDF ou DOCX · 20 Mo maximum)</span>
          <input accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" id="report" name="report" onChange={handleReportSelection} type="file" />
          {errors.report && <span className="field-error">{errors.report.join(" ")}</span>}
          {selectedReportName && <span className="selected-file-name" aria-live="polite">Rapport sélectionné : {selectedReportName}</span>}
          <span className="field-hint">Le rapport reste privé pendant l’examen. Après validation du projet et du rapport, tout visiteur pourra le télécharger.</span>
        </label>
      </div>
      <label className="check-field check-consent">
        <input name="participant_consent" required type="checkbox" value="1" />
        J’ai l’accord des participants et le droit de partager ce projet et son rapport publiquement après validation. Aucun renseignement confidentiel n’y figure. *
      </label>
      {errors.participant_consent && <p className="field-error">{errors.participant_consent.join(" ")}</p>}
      <button className="button button-orange submit-button" disabled={submitting} type="submit">
        {submitting ? "Envoi en cours…" : "Envoyer pour validation"} <span aria-hidden="true">↗</span>
      </button>
      <p className="privacy-footnote">Le projet, ses images et son rapport restent privés pendant la vérification. La publication du rapport nécessite une validation distincte de l’équipe EXPOSIS.</p>
    </form>
  );
}
