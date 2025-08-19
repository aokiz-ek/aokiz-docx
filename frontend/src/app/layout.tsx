import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import "./globals.css";

// 引入 Antd React 19 兼容性配置
import "@/lib/antd-compat";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aokiz Docx - 在线文档编辑器",
  description: "专业的团队协作文档编辑平台，支持实时协作、版本控制、评论批注等功能",
  keywords: "文档编辑器,在线编辑,团队协作,文档管理,实时协作",
  authors: [{ name: "Aokiz Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} antialiased`}>
        <AntdRegistry>
          {children}
        </AntdRegistry>
      </body>
    </html>
  );
}
