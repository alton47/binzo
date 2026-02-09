import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[hsl(var(--bg))] text-[hsl(var(--text))]">
        {children}
      </body>
    </html>
  );
}
