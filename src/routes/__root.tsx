import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AuthProvider } from "@/lib/auth/provider";
import { useProgress } from "@/lib/progress-store";
import appCss from "../styles.css?url";

const APP_NAME = "音迹";
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Sans:wght@400;500;600;700&family=Noto+Serif+SC:wght@600;700&display=swap";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "description", content: "给初学者的 DJ 音标日课：书写、朗读、记忆，24 天学完 48 个音标。" },
      { name: "theme-color", content: "#2A5848" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: FONT_HREF },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: RootDocument,
  notFoundComponent: NotFound,
});

function RootDocument() {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <ShellSwitch />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

function ShellSwitch() {
  useEffect(() => {
    void Promise.resolve(useProgress.persist.rehydrate()).then(() => {
      if (!useProgress.getState().onboarded) {
        useProgress.getState().completeOnboarding();
      }
    });
  }, []);

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

function NotFound() {
  return (
    <main className="px-6 py-24 text-center">
      <p className="font-display text-2xl font-semibold">这一页不在课程里</p>
      <p className="mt-2 text-sm text-muted">回首页，从停下的地方继续。</p>
      <a href="/" className="mt-6 inline-block text-sm font-medium text-primary">
        回首页
      </a>
    </main>
  );
}
