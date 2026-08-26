import type { Metadata } from "next";
import { site } from "@/lib/content";
import { ANALYTICS_ENABLED } from "@/lib/analytics";
import LegalPage, { H2, P, UL } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Lobster Lab collects, uses and shares personal information submitted through lobsterlab.us.",
};

/**
 * Updated 19 August 2026 to name the actual processor: the catering form now posts to
 * /api/catering, which delivers via Resend, not Formspree. Formspree was never wired up (its
 * env var was unset, so submissions went nowhere); this page named it anyway as the intended
 * processor, and that statement is false the moment a real one is live, so it changes in the
 * same commit as the code, not after.
 *
 * Updated 12 August 2026 to add the California CCPA/CPRA disclosures.
 *
 * Why now: this policy was written when it was unknown whether the operator met
 * the CCPA's applicability thresholds, so it deliberately made no CCPA claims.
 * On 10 August 2026 the client confirmed Tiger Hospitality Group's annual gross
 * revenue is above US$25 million (Cal. Civ. Code s 1798.140(d)(1)(A)), which
 * makes it a "business" under the Act. The disclosures below are required from
 * that point, not optional.
 *
 * If that answer is ever corrected downward, do not simply delete this section,
 * check the other two thresholds first: 100,000+ consumers/households of
 * personal information a year, or 50%+ of revenue from selling or sharing it.
 *
 * This is a good-faith implementation by a build team, not legal advice, and it
 * has not been reviewed by a lawyer. See docs/reports for what still needs
 * counsel's eye.
 */
const EFFECTIVE = "August 19, 2026";

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
          "Resend, delivers catering inquiry submissions from this website to us by email",
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

      <H2>Do Not Track and Global Privacy Control</H2>
      <P>
        We do not track visitors across third-party websites over time, so we take no action in
        response to Do Not Track browser signals. We also do not sell or share personal information,
        so there is nothing for an opt-out preference signal such as Global Privacy Control to switch
        off. If that ever changes, we will honour those signals as an opt-out request and say so
        here.
      </P>

      <H2>How long we keep it</H2>
      <P>
        We keep catering inquiries for as long as needed to serve your request and for our ordinary
        business and tax records, and no longer than <strong>three years</strong> after our last
        contact with you about that request, unless the law requires us to keep them longer. Server
        request logs held by our host are kept on that provider&apos;s standard schedule, which is a
        matter of weeks, not years. You can ask us to delete your information sooner at any time.
      </P>

      <H2>Your California privacy rights</H2>
      <P>
        Lobster Lab is operated by {site.operator}, which is a &ldquo;business&rdquo; under the
        California Consumer Privacy Act as amended by the California Privacy Rights Act. If you are a
        California resident, this section applies to you. It also describes how we treat everyone
        else, because we would rather run one standard than two.
      </P>

      <H2>What we collect, in the Act&apos;s categories</H2>
      <P>
        In the last twelve months, the only category of personal information this website has
        collected is:
      </P>
      <UL
        items={[
          "Identifiers, your name, phone number and email address, from the catering inquiry form",
          "Commercial information, the details of the event you are asking us to cater, number of people, date, time, occasion, pickup or delivery, and anything you write in the description",
          "Internet or network activity, standard server request logs kept by our host, which include IP address and browser type",
        ]}
      />
      <P>
        We collect it directly from you, except the server logs, which are generated automatically
        when any website is loaded. We use it only for the purposes listed further up this page.
      </P>
      <P>
        <strong>
          We do not collect sensitive personal information, we do not sell personal information, and
          we do not share it for cross-context behavioural advertising.
        </strong>{" "}
        We have not done either of those things in the preceding twelve months, including with
        respect to anyone we know to be under 16. We do not use or disclose personal information for
        any purpose other than those disclosed here.
      </P>

      <H2>Your rights under the Act</H2>
      <UL
        items={[
          "To know what personal information we have collected about you, where it came from, why we collected it, and who we disclosed it to",
          "To get a copy of that information",
          "To have it corrected if it is wrong",
          "To have it deleted, subject to the narrow exceptions the Act allows, for example where we must keep a record for tax purposes",
          "To opt out of the sale or sharing of your personal information, which is a right you already have in full here, because we do neither",
          "To limit the use of sensitive personal information, which does not arise here, because we do not collect any",
          "Not to be discriminated against for exercising any of these rights. We will not refuse you service, charge you a different price, or give you a lesser experience because you asked",
        ]}
      />

      <H2>How to make a request</H2>
      <P>
        Email{" "}
        <a className="font-semibold text-orange underline" href={`mailto:${site.email}`}>
          {site.email}
        </a>{" "}
        with what you would like us to do, or write to {site.operator} at 888 Prospect Street, Suite
        200, La Jolla, CA 92037.
      </P>
      <P>
        We will confirm we have your request within <strong>10 business days</strong> and answer it
        within <strong>45 calendar days</strong>. If we genuinely need longer we will tell you why,
        and take at most another 45 days. There is no charge.
      </P>
      <P>
        Before we act on a request about personal information we have to be reasonably sure it is
        really you, so we will ask you to confirm details that match what we already hold, usually
        the email address or phone number the inquiry was sent from. We use what you send us for
        verification and nothing else. You can also use an authorised agent, in which case we will
        ask for written permission from you and will still verify your identity directly.
      </P>

      <H2>Shine the Light</H2>
      <P>
        California Civil Code section 1798.83 lets California residents ask a business once a year
        for a list of the personal information it disclosed to third parties for their own direct
        marketing use. We do not disclose personal information for that purpose, so there is nothing
        to list, but you are welcome to ask using the details above.
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
