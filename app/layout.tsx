import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatBot from "@/components/ChatBot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Utkarsh Awasthi | Creative Portfolio",
  description: "A blend of creative chaos and technical precision.",
};

import { createClient } from '@/utils/supabase/server'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient()
  
  // Check if chatbot is active in main_v4
  const { data } = await supabase
    .from('main_v4')
    .select('is_active')
    .eq('side', 'chatbot')
    .single()
    
  const isChatbotActive = data?.is_active ?? false

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {isChatbotActive && <ChatBot />}
      </body>
    </html>
  );
}
