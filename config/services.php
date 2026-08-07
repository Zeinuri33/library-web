<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],

        'pengunjung' => [
        'api_url' => env('PENGUNJUNG_API_URL'),
        'verify_ssl' => env('PENGUNJUNG_VERIFY_SSL', true),
    ],
    ],

    /*
    |--------------------------------------------------------------------------
    | API Pemantau Pengunjung
    |--------------------------------------------------------------------------
    |
    | Panggilan dilakukan server-side dari controller. `api_url` bisa di-override
    | lewat env PENGUNJUNG_API_URL, misalnya menunjuk IP/internal host agar
    | request tidak perlu melewati WAF SafeLine di depan domain publik.
    |
    | `verify_ssl` (PENGUNJUNG_VERIFY_SSL) di-nonaktifkan hanya jika WAF
    | melakukan inspeksi TLS dengan sertifikat yang tidak dikenal server.
    |
    */

    'pengunjung' => [
        'api_url' => env(
            'PENGUNJUNG_API_URL',
            'https://opac.ibrahimy.ac.id/api/PengunjungApiController.php?token=pengunjungAPI97'
        ),
        'verify_ssl' => env('PENGUNJUNG_VERIFY_SSL', true),
    ],

];
