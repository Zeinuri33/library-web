@php
    $seo = app(\App\Services\SeoMetaService::class)->forPage($page ?? [], request()->url());
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- SEO / Open Graph meta (dibaca crawler WhatsApp, Facebook, dll.) --}}
        <meta name="description" content="{{ $seo['description'] }}">

        <meta property="og:type" content="{{ $seo['type'] }}">
        <meta property="og:title" content="{{ $seo['title'] }}">
        <meta property="og:description" content="{{ $seo['description'] }}">
        <meta property="og:image" content="{{ $seo['image'] }}">
        <meta property="og:url" content="{{ $seo['url'] }}">
        <meta property="og:site_name" content="{{ config('app.name') }}">

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $seo['title'] }}">
        <meta name="twitter:description" content="{{ $seo['description'] }}">
        <meta name="twitter:image" content="{{ $seo['image'] }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
           html {
  /* mirip bg-white / gray-50 */
  background-color: oklch(0.985 0 0);
}

html.dark {
  /* mirip gray-900 */
  background-color: oklch(0.145 0 0);
}

            body {
                font-family: 'Inter', sans-serif;
            }
        </style>

        <link rel="icon" href="/logo%20perpus.png" sizes="any">
        <link rel="apple-touch-icon" href="/logo%20perpus.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700&display=swap" rel="stylesheet" />

        <script>
    (() => {
        const theme =
            localStorage.getItem("docs-theme")

        if (theme !== "light") {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    })()
</script>

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>Perpustakaan Ibrahimy</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
