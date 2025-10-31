export default () => ({
  app: {
    name: 'GreenVast API',
    env: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '4000', 10),
    prefix: process.env.API_PREFIX ?? 'api',
    corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  },
  database: {
    url: process.env.DATABASE_URL ?? '',
  },
  redis: {
    host: process.env.REDIS_HOST ?? '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD ?? undefined,
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID ?? '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined,
  },
  storage: {
    bucket: process.env.S3_BUCKET ?? process.env.SUPABASE_BUCKET ?? '',
    region: process.env.AWS_REGION ?? 'us-east-1',
    endpoint: process.env.S3_ENDPOINT ?? '',
    accessKey: process.env.S3_ACCESS_KEY ?? '',
    secretKey: process.env.S3_SECRET_KEY ?? '',
    supabaseUrl: process.env.SUPABASE_URL ?? '',
    supabaseServiceRole: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  },
  integrations: {
    openWeatherKey: process.env.OPENWEATHER_API_KEY ?? '',
    kamisBaseUrl:
      process.env.KAMIS_BASE_URL ??
      'https://kamis-api.rma.go.ke/api/commodity-prices',
    kamisApiKey: process.env.KAMIS_API_KEY ?? '',
    analyticsWebhook: process.env.ANALYTICS_WEBHOOK_URL ?? '',
    pythonServiceUrl: process.env.PYTHON_SVC_URL ?? 'http://localhost:8000',
  },
  admin: {
    emails: (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean),
  },
  weather: {
    defaultLat: parseFloat(process.env.WEATHER_DEFAULT_LAT ?? '-1.286389'),
    defaultLon: parseFloat(process.env.WEATHER_DEFAULT_LON ?? '36.817223'),
  },
});
