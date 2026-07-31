import type { Metadata } from "next";
import { site } from "@/lib/content";
import LegalPage, { H2, P } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that apply to your use of lobsterlab.us.",
};

const EFFECTIVE = "July 29, 2026";

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" effective={EFFECTIVE}>
      <P>
        These terms apply to your use of <strong>lobsterlab.us</strong>, operated by {site.operator}.
        By using this website you agree to them.
      </P>

      <H2>What this website is</H2>
      <P>
        This website provides information about Lobster Lab, our menus, locations, hours and
        catering. It is an informational site. We do not take payment here.
      </P>

      <H2>Ordering happens elsewhere</H2>
      <P>
        Links to order pickup, delivery or catering take you to third-party services: Toast,
        DoorDash, Grubhub and ezCater. Your order, payment, delivery and any refund are governed by
        that provider&apos;s terms, not ours. We do not control their pricing, availability, fees or
        delivery times.
      </P>

      <H2>Menus, prices and availability</H2>
      <P>
        Menus and prices shown or linked here may change and may differ between locations. Items can
        sell out. We work to keep everything current, but the menu and price in effect at the
        location or on the ordering platform at the time you order are the ones that apply.
      </P>

      <H2>Food allergies</H2>
      <P>
        We prepare seafood, shellfish, dairy, gluten and other common allergens in shared kitchens,
        and we cannot guarantee any item is free of a given allergen. If you have a food allergy,
        please speak to staff at the location before ordering.
      </P>

      <H2>Hours and locations</H2>
      <P>
        Hours listed here are our regular hours and may change for holidays or events. Please check
        with the location or its Google listing if you are making a special trip.
      </P>

      <H2>Our content</H2>
      <P>
        The Lobster Lab name, logo, photography and site content are owned by {site.operator} or its
        licensors. Please do not reproduce them commercially without permission.
      </P>

      <H2>Guest reviews</H2>
      <P>
        Quotes shown on this site are guest reviews originally published on third-party platforms.
        They reflect those guests&apos; own experiences and opinions, not a promise about your visit.
      </P>

      <H2>Accessibility</H2>
      <P>
        We are working to keep this site usable by everyone. See our{" "}
        <a className="font-semibold text-orange underline" href="/accessibility">
          accessibility statement
        </a>
, and tell us if anything gets in your way.
      </P>

      <H2>Changes</H2>
      <P>
        We may update these terms. The effective date at the top of this page shows when they last
        changed.
      </P>

      <H2>Contact</H2>
      <P>
        Questions about these terms: email{" "}
        <a className="font-semibold text-orange underline" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        .
      </P>
    </LegalPage>
  );
}
