import '@/styles/globals.css'
import Navbar from '@/components/Navbar';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
