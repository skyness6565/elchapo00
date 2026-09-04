const COLUMNS = [
  {
    heading: "Services",
    links: ["Personal Banking", "Business Banking", "Loans & Credit", "Investments"],
  },
  { heading: "Company", links: ["About Us", "Contact", "Support"] },
  { heading: "Legal", links: ["Privacy Policy", "Terms of Service", "FDIC Insurance"] },
];

export function Footer() {
  return (
    <footer className="bg-surface-deep py-16">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-xl font-bold text-foreground">Heritage Bank</div>
            <p className="mt-4 text-sm text-muted-foreground">Banking Excellence Since 1885</p>
            <address className="mt-5 space-y-2 text-sm text-muted-foreground not-italic">
              <div>8001 South Orange Blossom Trail, Orlando, FL 32809</div>
              <a
                href="mailto:heritagebsupport@gmail.com"
                className="block transition-colors hover:text-primary"
              >
                heritagebsupport@gmail.com
              </a>
            </address>
          </div>
          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <div className="font-semibold text-foreground">{column.heading}</div>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
          © 2024 Heritage Bank. All rights reserved. Member FDIC. Equal Housing Lender.
        </div>
      </div>
    </footer>
  );
}
