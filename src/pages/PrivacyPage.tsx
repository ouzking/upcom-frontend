import { Link } from "react-router";
import { PageHero } from "@/components/layout/PageHero";
import { Seo } from "@/components/seo/Seo";
import { ROUTES } from "@/config/site";
import { useSiteInfo } from "@/hooks/queries";
import { breadcrumbJsonLd } from "@/lib/seo";

/** Politique de confidentialité : décrit fidèlement ce que le site collecte et pourquoi. */
export default function PrivacyPage() {
  const { data: site } = useSiteInfo();
  const company = site?.companyName ?? "UPCOM AGENCY & SERVICES";

  return (
    <>
      <Seo
        title="Politique de confidentialité"
        description="Comment UPCOM AGENCY & SERVICES traite les informations transmises via le site."
        jsonLd={breadcrumbJsonLd([{ name: "Politique de confidentialité", path: ROUTES.privacy }])}
      />
      <PageHero eyebrow="Vos données" title="Politique de confidentialité" crumbs={[{ label: "Politique de confidentialité" }]} />

      <article className="container-page max-w-3xl py-16 sm:py-24">
        <div className="prose-upcom">
          <p>
            {company} attache une grande importance à la protection de vos données personnelles, conformément à la loi sénégalaise n° 2008-12 du 25 janvier 2008 sur
            la protection des données à caractère personnel.
          </p>

          <h2>Données collectées</h2>
          <p>Le site ne collecte des données que lorsque vous remplissez un formulaire :</p>
          <ul>
            <li>
              <strong>Demande de projet</strong> : nom, entreprise, e-mail, téléphone, type de besoin, budget indicatif, délai souhaité et description du projet.
            </li>
            <li>
              <strong>Message de contact</strong> : nom, e-mail, téléphone, objet et message.
            </li>
          </ul>
          <p>
            Pour lutter contre les envois abusifs, une empreinte chiffrée et non réversible de votre adresse IP ainsi que le type de navigateur sont enregistrés avec la
            demande. Votre adresse IP n'est jamais conservée en clair.
          </p>

          <h2>Finalités</h2>
          <ul>
            <li>Répondre à votre demande et vous adresser une proposition adaptée.</li>
            <li>Vous envoyer un e-mail de confirmation de réception.</li>
            <li>Assurer le suivi de la relation commerciale.</li>
          </ul>
          <p>Vos données ne sont jamais vendues ni cédées à des tiers à des fins commerciales.</p>

          <h2>Destinataires et prestataires</h2>
          <p>
            Les demandes sont accessibles uniquement aux membres habilités de l'équipe {company}. Elles sont stockées chez Supabase (base de données), et les e-mails de
            notification et de confirmation sont envoyés par un prestataire d'envoi d'e-mails. Le site est hébergé par Netlify.
          </p>

          <h2>Durée de conservation</h2>
          <p>Les données sont conservées le temps nécessaire au traitement de votre demande et au suivi de la relation commerciale qui peut en découler.</p>

          <h2>Cookies et services tiers</h2>
          <p>
            Le site n'utilise ni cookie publicitaire ni outil de mesure d'audience. Les polices de caractères sont hébergées sur le site lui-même. La carte Google Maps et
            les vidéos YouTube ou Vimeo ne sont chargées qu'à votre demande (clic), ces services pouvant alors déposer leurs propres cookies.
          </p>

          <h2>Vos droits</h2>
          <p>
            Vous disposez d'un droit d'accès, de rectification, d'opposition et de suppression de vos données. Pour l'exercer, contactez-nous via la{" "}
            <Link to={ROUTES.contact}>page de contact</Link>. Vous pouvez également saisir la Commission de protection des données personnelles (CDP).
          </p>
        </div>
      </article>
    </>
  );
}
