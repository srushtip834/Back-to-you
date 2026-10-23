import "./globals.css";

export const metadata = {
  title: "Campus Find — Lost & Found",
  description: "A calmer, smarter way to reunite campus belongings with their owners.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}