import type { Metadata } from "next";
import { site } from "@/lib/content";
import { ANALYTICS_ENABLED } from "@/lib/analytics";
import LegalPage, { H2, P, UL } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Lobster Lab collects, uses and shares personal information submitted through lobsterlab.us.",
};

const EFFECTIVE = "July 29, 2026";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" effective={EFFECTIVE}>
      <P>
        This policy explains what personal information Lobster Lab collects through{" "}
        <strong>lobsterlab.us</strong>, why we collect it, and who we share it with. Lobster Lab is
        operated by {site.operator}.
      </P>

      <H2>Information we collect</H2>
      <P>
        We only collect what you choose to send us. If you submit a catering inquiry, we collect the
        information in that form:
      </P>
      <UL
        items={[
          "Your name",
          "Your phone number",
          "Your email address",
          "Event details you provide, number of people, date, time, occasion, whether you want pickup or delivery, and any description or requests you write",
        ]}
      />
      <P>
        We do not require an account, and we do not ask for payment details on this website. Ordering
        and catering checkout happen on third-party sites, see below.
      </P>

      <H2>How we use it</H2>
      <UL
        items={[
          "To respond to your catering inquiry and plan your order",
          "To contact you about that specific request",
          "To keep records of inquiries we have received",
        ]}
      />
      <P>
        We will not use your phone number to send you marketing text messages unless you have
        separately and expressly agreed to that. Agreeing to be contacted about your catering
        request is not the same as agreeing to marketing.
      </P>

      <H2>Who we share it with</H2>
      <P>
        We do not sell your personal information. We share it only with service providers who help
        us operate:
      </P>
      <UL
        items={[
          "Formspree, receives and delivers catering inquiry submissions to us",
          "Vercel, hosts this website and processes standard server request logs",
        ]}
      />
      <P>
        When you order food, you leave this website. Pickup and delivery are handled by{" "}
        <strong>Toast</strong>, <strong>DoorDash</strong> and <strong>Grubhub</strong>, and catering
        checkout by <strong>ezCater</strong>. Those companies collect and handle your information
        under their own privacy policies, not this one. Please read theirs before ordering.
      </P>

      <H2>Cookies and tracking</H2>
      {/* Rendered from the live config so this section can never drift out of
          date: with no analytics id set, the site genuinely loads no tracker. */}
      {ANALYTICS_ENABLED ? (
        <>
          <P>
            We use Google Analytics to understand how this website is used, for example which
            sections people read and where they drop off, so we can improve it.{" "}
            <strong>It only loads if you agree to it.</strong> When you first visit we ask, and we
            remember your answer. If you decline, no analytics script is loaded at all.
          </P>
          <P>
            We do not use advertising pixels, cross-site ad tracking, or session replay. IP
            addresses are anonymised and Google advertising signals are switched off.
          </P>
          <P>
            To change your mind, clear this site&apos;s data in your browser settings and you will
            be asked again on your next visit.
          </P>
        </>
      ) : (
        <P>
          This website does not currently use advertising cookies, analytics trackers, session
          replay, or third-party marketing pixels. If we add analytics in future, we will update
          this policy and ask for your consent first.
        </P>
      )}

      <H2>Do Not Track</H2>
      <P>
        Because we do not track visitors across third-party websites over time, we take no action in
        response to Do Not Track browser signals.
      </P>

      <H2>How long we keep it</H2>
      <P>
        We keep catering inquiries for as long as needed to serve your request and for our ordinary
        business records. You can ask us to delete yours at any time using the contact details
        below.
      </P>

      <H2>Your choices</H2>
      <P>
        You can ask us to access, correct or delete the information you have sent us. Email{" "}
        <a className="font-semibold text-orange underline" href={`mailto:${site.email}`}>
          {site.email}
        </a>{" "}
        and tell us what you need. We may ask you to confirm your identity before we act on a
        request about personal information.
      </P>

      <H2>Children</H2>
      <P>
        This website is intended for a general audience and is not directed to children under 13. We
        do not knowingly collect personal information from children under 13.
      </P>

      <H2>Changes to this policy</H2>
      <P>
        If we change this policy we will update the effective date at the top of this page. Material
        changes will be noted here.
      </P>

      <H2>Contact us</H2>
      <P>
        Questions about this policy or about your information: email{" "}
        <a className="font-semibold text-orange underline" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        .
      </P>
    </LegalPage>
  );
}
