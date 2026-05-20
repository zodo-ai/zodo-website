import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | ZODO AI',
  description: 'Login to book appointments and manage your health records',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
