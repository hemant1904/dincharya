import "./globals.css";

export const metadata = {
  title: "Dincharya",
  icons: {
    icon: "/icon.png",
  },
  description: "Your calm, AI planning companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body
        style={{
          margin: 0,
          fontFamily: "Inter, sans-serif"
        }}
      >
        {children}
      </body>
    </html>
  );
}
