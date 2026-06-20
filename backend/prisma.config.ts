import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
<<<<<<< Updated upstream
    "url": "postgresql://postgres.rsqbxctlxesjxmeaajqp:e82mGZfyuFx%24%3FF%2A@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"
  }
};
=======
    url: env("DATABASE_URL"),
  },
});
>>>>>>> Stashed changes
