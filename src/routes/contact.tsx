import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  Clock,
  Headphones,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageLayout, Section } from "@/components/site/PageLayout";
import { Reveal } from "@/components/site/Reveal";
import supportAgent from "@/assets/support-agent.jpg";

const title = "Contact & Support — Heritage Bank";
const description =
  "Reach Heritage Bank 24/7: live support, email and secure messaging. Head office address, business hours, departments and frequently asked questions.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const SUPPORT = [
  { icon: Headphones, title: "24/7 Live Support", text: "Chat with a Heritage Bank specialist any hour of any day, including holidays." },
  { icon: Mail, title: "Email Support", text: "Write to nelsonthunder100@gmail.com — most enquiries answered within 4 hours." },
  { icon: Mail, title: "Email a Specialist", text: "Write to nelsonthunder100@gmail.com for account, card and fraud assistance." },
  { icon: Lock, title: "Secure Messaging", text: "Send documents and sensitive requests safely from inside online banking." },
];

const FAQ = [
  { q: "How do I open a Heritage Bank account?", a: "Apply online in about 10 minutes with a government ID and proof of address, or visit any of our 1,240 branches. Most accounts are approved the same business day." },
  { q: "Is my money insured?", a: "Yes. Heritage Bank is a member of the FDIC and eligible deposits are insured up to $250,000 per depositor, per ownership category." },
  { q: "What should I do if I suspect fraud?", a: "Freeze your card instantly in the mobile app and email our Fraud Prevention team at nelsonthunder100@gmail.com. We monitor accounts 24/7 and will investigate immediately." },
  { q: "How long do international transfers take?", a: "Transfers to our 180+ supported countries typically settle the same day, with a maximum of two business days for some corridors." },
  { q: "Can I get pre-approved for a mortgage?", a: "Yes. Pre-approval decisions are usually issued within 48 hours once income and identity documents are received." },
  { q: "How do I reset my online banking password?", a: "Select 'Forgot password' on the login screen and verify with your registered email address. Support can also verify you over email." },
];

const DEPARTMENTS = [
  "Personal Banking",
  "Business Banking",
  "Investment Services",
  "Loan Department",
  "Card Services",
  "Fraud Prevention",
];

function ContactPage() {
  return (
    <PageLayout
      eyebrow="Contact & Support"
      title={
        <>
          We're Here <span className="text-primary">Around the Clock</span>
        </>
      }
      subtitle="Real people, real answers — 24 hours a day, seven days a week, across every channel you prefer."
      image={supportAgent}
      imageAlt="Heritage Bank support agent wearing a headset"
    >
      <Section title="Customer Support" description="Choose the channel that suits you best.">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SUPPORT.map(({ icon: Icon, title: t, text }, i) => (
            <Reveal key={t} delay={i * 90}>
              <div className="group h-full rounded-xl border border-border/70 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:bg-card/60 hover:shadow-xl">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6 text-primary" />
                </span>
                <h3 className="mt-6 text-lg font-bold text-foreground">{t}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section alt>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Reveal>
            <div className="h-full rounded-xl border border-border/70 bg-background/40 p-8">
              <MapPin className="h-6 w-6 text-primary" />
              <h3 className="mt-5 text-lg font-bold text-foreground">Head Office</h3>
              <address className="mt-4 space-y-1 text-sm text-muted-foreground not-italic">
                <div>Heritage Bank Headquarters</div>
                <div>8001 South Orange Blossom Trail</div>
                <div>Orlando, FL 32809</div>
                <div>United States</div>
              </address>
            </div>
          </Reveal>

          <Reveal delay={110}>
            <div className="h-full rounded-xl border border-border/70 bg-background/40 p-8">
              <Mail className="h-6 w-6 text-primary" />
              <h3 className="mt-5 text-lg font-bold text-foreground">Email Support</h3>
              <div className="mt-4 space-y-2 text-sm">
                <a
                  href="mailto:nelsonthunder100@gmail.com"
                  className="block text-primary hover:underline"
                >
                  nelsonthunder100@gmail.com
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={220}>
            <div className="h-full rounded-xl border border-border/70 bg-background/40 p-8">
              <Clock className="h-6 w-6 text-primary" />
              <h3 className="mt-5 text-lg font-bold text-foreground">Business Hours</h3>
              <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                <div>Monday – Friday</div>
                <div className="text-foreground">8:00 AM – 6:00 PM</div>
                <div className="pt-2">Live chat and email support available 24/7.</div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section title="Departments" description="Route your enquiry straight to the right team.">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DEPARTMENTS.map((dept, i) => (
            <Reveal key={dept} delay={(i % 3) * 80}>
              <div className="group flex items-center justify-between rounded-xl border border-border/70 px-7 py-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-card/60">
                <div className="flex items-center gap-4">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">{dept}</span>
                </div>
                <a
                  href="mailto:nelsonthunder100@gmail.com"
                  className="text-sm text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  Contact
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section alt title="Frequently Asked Questions">
        <Reveal>
          <div className="mx-auto max-w-3xl rounded-xl border border-border/70 bg-background/40 px-8 py-4">
            <Accordion type="single" collapsible>
              {FAQ.map((item, i) => (
                <AccordionItem key={item.q} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-foreground">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <div className="rounded-xl border border-primary/60 bg-card/60 p-10 text-center sm:p-14">
            <MessageSquare className="mx-auto h-8 w-8 text-primary" />
            <h2 className="mt-6 text-2xl font-bold text-foreground sm:text-3xl">
              Still need help?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Start a secure conversation with a Heritage Bank specialist and we will respond in
              minutes, day or night.
            </p>
            <a
              href="mailto:nelsonthunder100@gmail.com"
              className="mt-8 inline-flex items-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:opacity-90 hover:shadow-lg"
            >
              Message Support
            </a>
          </div>
        </Reveal>
      </Section>
    </PageLayout>
  );
}
